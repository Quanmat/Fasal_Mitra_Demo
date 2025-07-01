import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-green-700/80 hover:text-green-800 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-green-700/80 hover:text-green-800 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-green-700/80 hover:text-green-800 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Branding */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-green-800">
              फसल मित्र
            </h2>
            <p className="text-sm text-green-700/80">
              Your Trusted Agricultural Partner
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 md:text-right">
            <h3 className="text-lg font-medium text-green-800">
              Connect With Us
            </h3>
            <div className="space-y-2 text-green-700/80">
              <p>Email: info@fasalmitra.com</p>
              <p>Phone: +91 1234567890</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 pt-6 border-t border-green-100 text-center">
          <p className="text-sm text-green-700/80">
            &copy; {new Date().getFullYear()} Fasal Mitra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
