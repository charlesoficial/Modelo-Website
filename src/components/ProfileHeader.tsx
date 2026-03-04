import { Lock } from "lucide-react";
import { useSiteConfig } from "@/lib/siteConfig";
import defaultProfilePhoto from "@/assets/profile-photo.jpg";
import defaultBannerImage from "@/assets/banner.png";

const ProfileHeader = () => {
  const { config } = useSiteConfig();
  const { profile, stats } = config;

  const profileSrc = profile.profileImage || defaultProfilePhoto;
  const bannerSrc = profile.bannerImage || defaultBannerImage;

  return (
    <section className="flex flex-col items-center pb-8 w-full border-0 overflow-hidden">
      {/* Banner Cover */}
      <div className="relative w-full border-0">
        <div className="w-full h-48 md:h-64 overflow-hidden border-0">
          <img
            src={bannerSrc}
            alt="Banner de capa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        {/* Profile Photo - overlapping the banner */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl shadow-black/60 border-0">
              <img
                src={profileSrc}
                alt="Foto de perfil da criadora"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-card border border-border rounded-full p-1.5 shadow-md">
              <Lock className="w-3.5 h-3.5 text-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Content wrapper centered below banner */}
      <div className="mt-20 px-4 flex flex-col items-center w-full max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
          {profile.displayName}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base text-center max-w-xs leading-relaxed mb-1">
          {profile.bio}
        </p>
        <p className="text-muted-foreground/60 text-xs flex items-center gap-1.5 mb-6">
          <Lock className="w-3 h-3" />
          {profile.lockedMessage}
        </p>

        {/* CTA Button */}
        <a
          href="#planos"
          className="btn-subscribe-featured px-10 py-3 text-base w-auto inline-block text-center"
        >
          Assinar agora
        </a>

        {/* Stats */}
        <div className="flex gap-8 mt-6 text-center">
          <div>
            <p className="text-lg font-semibold">{stats.posts}</p>
            <p className="text-xs text-muted-foreground">publicações</p>
          </div>
          {config.settings.showSubscriberCount && (
            <div>
              <p className="text-lg font-semibold">{stats.subscribers}</p>
              <p className="text-xs text-muted-foreground">assinantes</p>
            </div>
          )}
          {config.settings.showMediaCount && (
            <div>
              <p className="text-lg font-semibold">{stats.mediaCount}</p>
              <p className="text-xs text-muted-foreground">mídias</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
