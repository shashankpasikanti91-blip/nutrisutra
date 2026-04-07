import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => (
  <>
    <Navbar />
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl py-16 px-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last Updated: April 7, 2026</p>

        <div className="prose prose-sm max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong className="text-foreground">NutriSutra</strong>, an AI-powered nutrition analysis platform operated by SRP AI Labs ("Company", "we", "us", or "our"). By accessing or using NutriSutra at
              nutrisutra.srpailabs.com ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please discontinue use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Definitions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Service</strong> — The NutriSutra web application, APIs, and all features provided by SRP AI Labs.</li>
              <li><strong className="text-foreground">User / Tenant</strong> — Any individual or organization that creates an account on NutriSutra.</li>
              <li><strong className="text-foreground">User Content</strong> — Text, images, or food entries submitted through the Service for nutrition analysis.</li>
              <li><strong className="text-foreground">Health Data</strong> — Information you provide such as weight, height, age, activity level, dietary goals, and food logs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Eligibility</h2>
            <p>
              You must be at least 13 years old to use NutriSutra. By using the Service, you represent that you meet this requirement. Users between 13 and 17 must have parental or guardian consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Account Registration</h2>
            <p>
              When you create an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials. Each account is isolated — your personal data is never visible to or shared with other users.
            </p>
            <p className="mt-2">
              A personal data profile is automatically created when you register, storing only your profile preferences and tracked meals locally on your device. No account data is shared across tenants.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Health & Nutrition Disclaimer</h2>
            <p>
              NutriSutra uses AI to provide nutrition estimates for educational and informational purposes only. Our analyses are approximations and <strong className="text-foreground">do not constitute medical advice, diagnosis, or treatment</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Calorie and macro estimates may vary from actual values.</li>
              <li>NutriSutra is not suitable as a substitute for a licensed dietitian, doctor, or healthcare professional.</li>
              <li>Individuals with medical conditions (diabetes, allergies, eating disorders, etc.) must consult a qualified health professional before relying on any data from this Service.</li>
              <li>NutriSutra is not an FDA-approved medical device and makes no claims to diagnose, treat, cure, or prevent any disease.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Image Uploads & Privacy</h2>
            <p>
              When you upload a food photo for AI analysis, the image is used <strong className="text-foreground">only for the duration of that analysis request</strong>. Raw image bytes are <strong className="text-foreground">never stored</strong> on our servers. Only lightweight metadata (file size, analysis result) is cached in-memory for performance.
            </p>
            <p className="mt-2">
              The platform owner does not view, access, or receive any images you upload. Your food photos remain private to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Prohibited Conduct</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Uploading illegal, offensive, or unrelated content.</li>
              <li>Attempting to reverse-engineer, scrape, or exploit the Service or its AI models.</li>
              <li>Sharing account credentials or circumventing access controls.</li>
              <li>Using the Service to collect data on other users without consent.</li>
              <li>Interfering with the platform's availability or performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Subscription & Trial</h2>
            <p>
              NutriSutra may offer a free trial period. After the trial expires, continued access to premium features requires a paid subscription. Pricing details are outlined on the Pricing page. Subscriptions are non-refundable unless required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Intellectual Property</h2>
            <p>
              All rights to the NutriSutra platform, design, logo, AI models, and content (excluding User Content) belong exclusively to SRP AI Labs. You may not copy, redistribute, or reverse-engineer any part of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access if you violate these Terms. Upon termination, your right to use the Service ceases immediately. You may delete your account at any time through the Settings page, which will clear all locally stored data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. SRP AI Labs disclaims all warranties including fitness for a particular purpose, accuracy of nutritional data, and uninterrupted availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SRP AI Labs shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Material changes will be communicated via the platform. Continued use after updates constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Governing Law</h2>
            <p>
              These Terms are governed by applicable laws. Any disputes shall be resolved through good-faith negotiation before resorting to arbitration or legal proceedings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">15. Contact</h2>
            <p>
              Questions about these Terms? Reach us at:{" "}
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

export default Terms;
