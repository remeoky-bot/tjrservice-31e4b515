import {
  Code2, Smartphone, Palette, Wrench, Building2, Zap,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  tagline: string;
  items: string[];
}

export const services: Service[] = [
  {
    icon: Code2,
    title: "Développement Web",
    tagline: "Sites et plateformes web rapides, modernes et sécurisés.",
    items: ["Sites vitrines", "Sites e-commerce", "Applications web", "Logiciels sur mesure"],
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles",
    tagline: "Apps natives et multi-plateformes pour iOS et Android.",
    items: ["Android", "iOS", "Multi-plateforme"],
  },
  {
    icon: Palette,
    title: "Design Graphique",
    tagline: "Une identité visuelle qui marque les esprits.",
    items: ["Logos", "Flyers", "Brochures", "Cartes de visite", "Affiches publicitaires"],
  },
  {
    icon: Wrench,
    title: "Informatique & Maintenance",
    tagline: "Gardez votre matériel et vos logiciels en parfait état.",
    items: ["Maintenance ordinateur", "Maintenance imprimante", "Installation logiciels"],
  },
  {
    icon: Building2,
    title: "Architecture & BTP",
    tagline: "De la conception au chantier, en plans 2D et 3D.",
    items: ["Plans 2D", "Modélisation 3D", "Devis de construction"],
  },
  {
    icon: Zap,
    title: "Électricité",
    tagline: "Installations électriques fiables et conformes.",
    items: ["Installation électrique", "Dépannage", "Maintenance"],
  },
];

export const contactInfo = {
  phones: ["+261 34 79 333 70", "+261 32 04 464 90"],
  whatsapp: "+261 34 81 016 11",
  whatsappLink: "https://wa.me/261348101611",
  email: "remeoky01@gmail.com",
  facebook: "https://web.facebook.com/profile.php?id=100052744453818",
  linkedin: "https://www.linkedin.com/in/joseph-remeoky-tafita-846728276",
  comeup: "https://comeup.com/en/@remeoky",
};