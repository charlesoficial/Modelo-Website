import { Check, Lock, Star, Crown, Gem, Zap } from "lucide-react";
import { useSiteConfig, type Plan } from "@/lib/siteConfig";

const ICONS = {
  zap: (cls?: string) => <Zap className={cls || "w-5 h-5"} />,
  star: (cls?: string) => <Star className={cls || "w-5 h-5"} />,
  crown: (cls?: string) => <Crown className={cls || "w-5 h-5 text-gold"} />,
  gem: (cls?: string) => <Gem className={cls || "w-5 h-5 text-gold"} />,
};

const PlanCard = ({ plan, index }: { plan: Plan; index: number }) => {
  const Icon = ICONS[plan.icon] || ICONS.zap;
  return (
    <div
      className={`${plan.featured ? "card-plan-featured" : "card-plan"} opacity-0 animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {plan.label && (
        <span className="badge-popular text-[9px] px-2 py-0.5 sm:text-xs sm:px-4 sm:py-1">
          {plan.label}
        </span>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
        <span className="[&_svg]:w-4 [&_svg]:h-4 sm:[&_svg]:w-5 sm:[&_svg]:h-5">
          {Icon()}
        </span>
        <h3 className="text-sm sm:text-lg font-serif font-semibold tracking-wide">
          {plan.name}
        </h3>
      </div>

      <div className="mb-3 sm:mb-5">
        <span className="text-lg sm:text-3xl font-bold">R${plan.price}</span>
        <span className="text-muted-foreground text-[10px] sm:text-sm">/mês</span>
      </div>

      <ul className="space-y-1.5 sm:space-y-2.5 mb-4 sm:mb-6 hidden sm:block">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <ul className="space-y-1 mb-3 sm:hidden">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-1 text-[10px] text-muted-foreground">
            <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={plan.checkoutUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`${plan.featured ? "btn-subscribe-featured" : "btn-subscribe-default"} text-[10px] sm:text-sm py-2 sm:py-3 block text-center`}
      >
        <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1 -mt-0.5" />
        Assinar
      </a>
    </div>
  );
};

const SubscriptionPlans = () => {
  const { config } = useSiteConfig();
  const activePlans = config.plans.filter((p) => p.active);

  return (
    <section id="planos" className="px-4 py-12 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-2">
        Escolha seu plano
      </h2>
      <p className="text-muted-foreground text-sm text-center mb-10">
        Desbloqueie conteúdos exclusivos e tenha acesso total
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {activePlans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} index={i} />
        ))}
      </div>
    </section>
  );
};

export default SubscriptionPlans;
