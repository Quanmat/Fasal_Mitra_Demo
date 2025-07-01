import os
import sys
import django
import random
from faker import Faker
from django.core.files.uploadedfile import SimpleUploadedFile

# Add the project root directory to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.append(project_root)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Initialize Django
django.setup()

# Now import models after Django is set up
from users.models import (
    CustomUser, EmailVerificationToken, GovernmentIDVerification, 
    LandInformation, Address, GSTInfo, FarmerProfile, 
    BuyerProfile, CompanyProfile
)
from api.models import CropListingTemplate, ContractTemplate, Contract, Dispute
from payments.models import Order
from django.db import transaction

# Initialize Faker
fake = Faker('en_IN')  # Using Indian locale for more relevant data

def generate_random_image(filename='image.jpg'):
    """Generate a dummy image file."""
    from PIL import Image
    import io
    
    img = Image.new('RGB', (10, 10), color='black')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr = img_byte_arr.getvalue()
    
    return SimpleUploadedFile(
        name=filename, 
        content=img_byte_arr, 
        content_type='image/jpeg'
    )

# def generate_random_image(filename='image.jpg'):
#     media_folder = os.path.join(project_root, 'media', 'gst_certificates')
#     image_files = [f for f in os.listdir(media_folder) if os.path.isfile(os.path.join(media_folder, f))]
    
#     if not image_files:
#         raise FileNotFoundError("No images found in the media folder.")
    
#     random_image_file = random.choice(image_files)
#     with open(os.path.join(media_folder, random_image_file), 'rb') as img_file:
#         return SimpleUploadedFile(
#             name=filename,
#             content=img_file.read(),
#             content_type='image/jpeg'
#         )
    

def generate_random_contract_file(filename='contract.pdf'):
    media_folder = os.path.join(project_root, 'media', 'contract_documents')
    os.makedirs(media_folder, exist_ok=True)
    
    # Create a dummy PDF file
    from reportlab.pdfgen import canvas
    from io import BytesIO

    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 100, f"Dummy Contract: {filename}")
    p.showPage()
    p.save()
    
    return SimpleUploadedFile(
        name=filename,
        content=buffer.getvalue(),
        content_type='application/pdf'
    )

def create_contract_templates(users, crop_listings):
    """Create contract templates."""
    contract_templates = []
    farmers = [u for u in users if u.user_type == 'farmer']
    
    for _ in range(10):  # Create 10 contract templates
        # Randomly select a farmer and a crop
        submitter = random.choice(farmers)
        crop = random.choice(crop_listings)
        
        contract_template = ContractTemplate.objects.create(
            submitted_by=submitter,
            contract_name=fake.catch_phrase(),
            contract_description=fake.text(),
            contract_file=generate_random_contract_file(),
            price=round(random.uniform(1000, 100000), 2),
            approved=fake.boolean(chance_of_getting_true=70),
            crop=crop,
            total_quintal_required=round(random.uniform(10, 1000), 2)
        )
        
        contract_templates.append(contract_template)
    
    return contract_templates

def create_contracts(users, contract_templates):
    """Create contracts."""
    contracts = []
    farmers = [u for u in users if u.user_type == 'farmer']
    buyers = [u for u in users if u.user_type == 'buyer']
    
    for contract_template in contract_templates:
        # Randomly select a buyer and a seller
        buyer = random.choice(buyers)
        seller = random.choice(farmers)
        
        contract = Contract.objects.create(
            contract_template=contract_template,
            buyer=buyer,
            seller=seller,
            approved=fake.boolean(chance_of_getting_true=80),
            status=random.choice(["PENDING", "APPROVED", "REJECTED"]),
            signed_contract=generate_random_contract_file('signed_contract.pdf'),
            estimate_production_in_quintal=round(random.uniform(10, 1000), 2),
            ml_model_estimate_production_in_quintal=round(random.uniform(10, 1000), 2),
            estimate_total_price=round(random.uniform(1000, 100000), 2),
            ml_model_estimate_total_price=round(random.uniform(1000, 100000), 2)
        )
        
        contracts.append(contract)
    
    return contracts

def create_disputes(users, contracts):
    """Create disputes."""
    disputes = []
    
    for contract in contracts:
        # 30% chance of creating a dispute for each contract
        if random.random() < 0.3:
            dispute = Dispute.objects.create(
                contract=contract,
                raised_by=random.choice([contract.buyer, contract.seller]),
                description=fake.text(),
                status=random.choice(['pending', 'resolved', 'rejected']),
                admin_comment=fake.text() if random.random() < 0.5 else None
            )
            
            disputes.append(dispute)
    
    return disputes

def create_custom_users():
    """Create dummy users with different user types."""
    user_types = ['farmer', 'buyer', 'company', 'admin']
    users = []

    for user_type in user_types:
        unique_emails = set()
        for _ in range(5):  # Create 5 users of each type
            try:
                # Generate a unique email
                while True:
                    email = fake.email()
                    if email not in unique_emails:
                        unique_emails.add(email)
                        break

                # Use Django's create_user method
                user = CustomUser.objects.create_user(
                    email=email,
                    password='sih2024win',
                    user_type=user_type,
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    is_email_verified=fake.boolean(chance_of_getting_true=80),
                    is_gov_id_verified=fake.boolean(chance_of_getting_true=80),
                    is_active=True
                )
                
                users.append(user)
            except Exception as e:
                print(f"Error creating user: {e}")
    
    return users

def create_verification_processes(users):
    """Create verification processes for users."""
    for user in users:
        # Email Verification Token
        EmailVerificationToken.objects.get_or_create(user=user)
        
        # Government ID Verification (only for non-admin users)
        if user.user_type != 'admin':
            GovernmentIDVerification.objects.get_or_create(
                user=user,
                defaults={
                    'gov_id': fake.unique.ssn(),
                    'type_of_id': random.choice(['Aadhar Card', 'PAN Card', 'Voter ID']),
                    'is_verified': fake.boolean(chance_of_getting_true=70)
                }
            )
        
        # Profile Creation
        if user.user_type == 'farmer':
            FarmerProfile.objects.get_or_create(
                user=user,
                defaults={
                    'bio': fake.text(),
                    'profile_image': generate_random_image('farmer_profile.jpg')
                }
            )
        elif user.user_type == 'buyer':
            BuyerProfile.objects.get_or_create(
                user=user,
                defaults={
                    'bio': fake.text(),
                    'profile_image': generate_random_image('buyer_profile.jpg')
                }
            )
        elif user.user_type == 'company':
            company_profile, _ = CompanyProfile.objects.get_or_create(
                user=user,
                defaults={
                    'company_name': fake.company(),
                    'company_description': fake.text(),
                    'company_logo': generate_random_image('company_logo.jpg'),
                    'iso': f"ISO {fake.random_number(digits=4)}:{fake.random_number(digits=4)}"
                }
            )
            
            # GST Info specifically for company
            GSTInfo.objects.get_or_create(
                user=user,
                defaults={
                    'gst_number': f"07{fake.random_number(digits=14)}",
                    'gst_certificate': generate_random_image('gst_cert.jpg'),
                    'is_verified': fake.boolean(chance_of_getting_true=80)
                }
            )

def create_additional_data(users):
    """Create additional data like addresses and land info."""
    farmers = [u for u in users if u.user_type == 'farmer']
    for user in users:
        # Addresses
        Address.objects.get_or_create(
            user=user,
            defaults={
                'address_line_1': fake.street_address(),
                'address_line_2': fake.street_address(),
                'city': fake.city(),
                'state': fake.state(),
                'pincode': fake.postcode()
            }
        )
    
    # Land Information for Farmers
    for farmer in farmers:
        LandInformation.objects.get_or_create(
            user=farmer,
            defaults={
                'land_area': round(random.uniform(1, 100), 2),
                'land_location': fake.city(),
                'document_image': generate_random_image('land_doc.jpg'),
                'is_verified': fake.boolean(chance_of_getting_true=60)
            }
        )

def create_crop_listings():
    """Create crop listing templates."""
    crop_listings = []
    for crop_type in ['kharif', 'rabi', 'zaid']:
        for crop_name in ['Wheat', 'Rice', 'Corn', 'Barley', 'Sugarcane', 'Cotton']:
            crop, _ = CropListingTemplate.objects.get_or_create(
                crop_type=crop_type,
                name=crop_name,
                defaults={
                    'description': fake.text(),
                    'image': generate_random_image(f'{crop_name.lower()}_crop.jpg')
                }
            )
            crop_listings.append(crop)
    return crop_listings

def main():
    # Clear existing data to prevent duplicates
    models_to_clear = [
        CustomUser, EmailVerificationToken, GovernmentIDVerification, 
        LandInformation, Address, GSTInfo, 
        FarmerProfile, BuyerProfile, CompanyProfile, 
        CropListingTemplate, ContractTemplate, Contract, Dispute, Order
    ]
    
    for model in models_to_clear:
        model.objects.all().delete()

    # Generate data
    users = create_custom_users()
    create_verification_processes(users)
    create_additional_data(users)
    print(f"Total users created: {len(users)}")
    crop_listings = create_crop_listings()
    print(f"Total crop listings created: {len(crop_listings)}")
    
    # Create contract-related data
    contract_templates = create_contract_templates(users, crop_listings)
    print(f"Total contract templates created: {len(contract_templates)}")

    contracts = create_contracts(users, contract_templates)
    print(f"Total contracts created: {len(contracts)}")
    disputes = create_disputes(users, contracts)
    print(f"Total disputes created: {len(disputes)}")
    
    print("Dummy data generation complete!")

if __name__ == "__main__":
    main()