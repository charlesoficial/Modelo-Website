import ProfileHeader from "@/components/ProfileHeader";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import BlurredPreviews from "@/components/BlurredPreviews";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileHeader />
      <div className="max-w-2xl mx-auto px-4">
        <BlurredPreviews />
        <SubscriptionPlans />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
