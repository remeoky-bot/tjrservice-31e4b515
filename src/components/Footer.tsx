import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import logo from "@/assets/tjr-logo.jpg.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-[oklch(0.18_0.04_265)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logo.url} alt="TJR Service" className="h-10 w-10 rounded-lg bg-white object-contain" />
            <span className="font-display text-lg font-bold">TJR Service</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Votre partenaire de confiance en technologies et en BTP. Création web,
            applications, design et solutions techniques à Antananarivo, Madagascar.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://web.facebook.com/profile.php?id=100052744453818" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full glass hover:text-cyan-accent"><Facebook className="h-4 w-4" /></a>
            <a href="https://www.linkedin.com/in/joseph-remeoky-tafita-846728276" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full glass hover:text-cyan-accent"><Linkedin className="h-4 w-4" /></a>
            <a href="https://comeup.com/en/@remeoky" target="_blank" rel="noreferrer" aria-label="ComeUp" className="grid h-9 w-9 place-items-center rounded-full glass hover:text-cyan-accent"><ExternalLink className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Liens rapides</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Accueil</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link to="/about" className="hover:text-foreground">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/devis" className="hover:text-foreground">Demander un devis</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Développement Web</li>
            <li>Applications Mobiles</li>
            <li>Design Graphique</li>
            <li>Maintenance Informatique</li>
            <li>Architecture &amp; BTP</li>
            <li>Électricité</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-accent" /><span>+261 34 79 333 70<br />+261 32 04 464 90</span></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-accent" /><a href="mailto:remeoky01@gmail.com" className="hover:text-foreground">remeoky01@gmail.com</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-accent" /><span>Antananarivo, Madagascar</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} TJR Service – Tous droits réservés
        </div>
      </div>
    </footer>
  );
}