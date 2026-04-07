import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => (
  <>
    <Navbar />
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl py-16 px-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last Updated: April 7, 2026</p>

        <div className="space-y-10 text-muted-foreground leading-relaxed text-sm">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Overview</h2>
            <p>
              SRP AI Labs ("we", "us", or "our") operates NutriSutra at nutrisutra.srpailabs.com. This Privacy Policy explains what data we collect, how we use it, and the choices you have. We are committed to protecting your privacy — especially your health and nutrition data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Data We Collect</h2>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.1 Registration Data</h3>
            <p>When you create an account, we collect your name and email address for the purposes of account identification and service notifications.</p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.2 Health & Profile Data</h3>
            <p>To personalize calorie goals, we collect optional profile information you enter in Settings:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Age, gender, height, and weight</li>
              <li>Activity level and dietary goal (e.g., weight loss, muscle gain)</li>
              <li>Daily meal and water logs</li>
            </ul>
            <p className="mt-2">This data is stored locally on your device and is never synced to our servers unless you explicitly enable cross-device sync in the future.</p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.3 Food Images (Temporary Only)</h3>
            <p>
              When you upload a food photo for AI analysis, the image is processed <strong className="text-foreground">in memory only</strong> and is <strong className="text-foreground">immediately discarded</strong> after the analysis completes. We do not store, log, or transmit your food photos. The platform owner has no access to any photos you upload.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.4 Usage Events</h3>
            <p>We collect anonymised events such as new account registrations and application errors to monitor platform health. We do <strong className="text-foreground">not</strong> collect details of what you scan or analyze — only that an action occurred.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Service delivery</strong> — Food identification, calorie estimation, and nutrition tracking.</li>
              <li><strong className="text-foreground">Personalisation</strong> — Calculating your daily calorie and water goals based on your profile using the Mifflin-St Jeor formula.</li>
              <li><strong className="text-foreground">Platform monitoring</strong> — Detecting errors and service issues so we can fix them promptly.</li>
              <li><strong className="text-foreground">Account management</strong> — Notifying you about your account when necessary.</li>
            </ul>
            <p className="mt-3">We do <strong className="text-foreground">not</strong> sell your data. We do not use your food photos or meal logs to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Isolation</h2>
            <p>
              Each user account is fully isolated. Your meal history, profile, and goals are stored in your browser's local storage and are inaccessible to other users or to the platform operator. No user can see another user's data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data We Do Not Store</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Food photographs or camera images</li>
              <li>Barcode scan images</li>
              <li>The specific foods or meals you analyze</li>
              <li>Progress photos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Third-Party Services</h2>
            <p>NutriSutra uses the following third-party services to operate:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-foreground">OpenRouter / OpenAI</strong> — For AI-powered food image analysis. Images are sent securely over HTTPS and are subject to OpenRouter's own data policies. No images are retained by us.</li>
              <li><strong className="text-foreground">Hetzner Cloud</strong> — Our server infrastructure, located in the EU.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Access</strong> — View your profile and history in the app at any time.</li>
              <li><strong className="text-foreground">Correction</strong> — Update your profile data from the Settings page.</li>
              <li><strong className="text-foreground">Deletion</strong> — Clear all stored data by logging out or using your browser's storage settings. You may also contact us to request account deletion.</li>
              <li><strong className="text-foreground">Portability</strong> — Your data is in standard localStorage format and can be exported manually.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
            <p>
              NutriSutra is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has registered, contact us immediately at{" "}
              <a href="mailto:support@srpailabs.com" className="text-primary hover:underline">support@srpailabs.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Security</h2>
            <p>
              We implement technical and organisational measures to protect your data, including HTTPS encryption, server-side access controls, and no persistent image storage. However, no system is completely secure, and you use the Service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy as the Service evolves. We will indicate the updated date at the top of this page. Continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>
              For privacy-related questions or data deletion requests, contact us at:{" "}
              <a href="mailto:support@srpailabs.com" className="text-primary hover:underline">
                support@srpailabs.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Privacy;
