import { inject, Injectable, OnDestroy } from "@angular/core";
import { ConfigService } from "@sinequa/ngx-ui-builder";

import { hexToHSL, hexToRGBA, RGBAToHexA, shadeColor, tintColor } from "./colors";
import { Subscription } from "rxjs";

type ColorVariants = "primary" | "secondary" | "brand";

export const configFactory = (global: GlobalService) => {
  global.startListening();
}

@Injectable({ providedIn: "root"})
export class GlobalService implements OnDestroy {

  private subscription: Subscription;

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  startListening() {
    if (!this.subscription) {
      const configService = inject(ConfigService);
      this.subscription = configService.watchConfig("global")
        .subscribe(value => this.changes(value as any));
    }
  }

  changes({backgroundColor, brandingColor, primaryColor, secondaryColor, textColor, theme, fontFamily, backgroundImage, gradientColor}): void {
    if (theme) {
      document.body.classList.add("sinequa");
    }

    if(fontFamily) {
      document.documentElement.style.setProperty('--bs-body-font-family', fontFamily);
    }
    else {
      document.documentElement.style.removeProperty("--bs-body-font-family");
    }

    if(backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundPosition = '50%';
      document.body.style.backgroundSize = 'cover';
    }
    else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundSize = '';
    }

    if(!backgroundImage && backgroundColor) {
      document.documentElement.style.setProperty('--bs-body-bg', backgroundColor);
    }
    else {
      document.documentElement.style.removeProperty('--bs-body-bg');
    }

    if(!backgroundImage && gradientColor) {
      document.documentElement.style.setProperty('--gradient-color', gradientColor);
    }
    else {
      document.documentElement.style.removeProperty('--gradient-color');
    }

    if (primaryColor) {
      this.setColorVariants(primaryColor, "primary");
      document.documentElement.style.setProperty('--primary', `var(--primary-300)`);
      const [r, g, b] = hexToRGBA(primaryColor);
      document.documentElement.style.setProperty('--primary-rgb',`${r},${g},${b}` );
    }
    else {
      this.unsetColorVariants("primary");
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-rgb');
    }

    if (secondaryColor) {
      this.setColorVariants(secondaryColor, "secondary");
      document.documentElement.style.setProperty('--secondary', `var(--secondary-300)`);
      const [r, g, b] = hexToRGBA(secondaryColor);
      document.documentElement.style.setProperty('--secondary-rgb',`${r},${g},${b}` );
    }
    else {
      this.unsetColorVariants("secondary");
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--secondary-rgb');
    }

    if (brandingColor) {
      const [h, s, l] = hexToHSL(brandingColor);

      document.documentElement.style.setProperty('--brand-hue', `${h}`);
      document.documentElement.style.setProperty('--brand-saturation', `${s}%`);
      document.documentElement.style.setProperty('--brand-lightness', `${l}%`);

      this.setColorVariants(brandingColor, "brand");
      document.documentElement.style.setProperty('--brand', `var(--brand-300)`);

      document.documentElement.style.setProperty('--text1', 'hsl(var(--brand-hue) var(--brand-saturation) 10%)');
      document.documentElement.style.setProperty('--text2', 'hsl(var(--brand-hue) 20% 70%)');
      document.documentElement.style.setProperty('--text3', 'hsl(var(--brand-hue), calc(80% - var(--brand-saturation)), calc(180% - var(--brand-lightness)) )');
      document.documentElement.style.setProperty('--text3-hover', 'hsl(var(--brand-hue), var(--brand-saturation), calc(160% - var(--brand-lightness)) )');
      document.documentElement.style.setProperty('--sq-text', 'var(--text3)');
      document.documentElement.style.setProperty('--sq-text-hover', 'var(--text2)');
    }
    else {
      document.documentElement.style.removeProperty('--brand-hue');
      document.documentElement.style.removeProperty('--brand-saturation');
      document.documentElement.style.removeProperty('--brand-lightness');
      this.unsetColorVariants("brand");
      document.documentElement.style.removeProperty('--brand');
      document.documentElement.style.removeProperty('--text1');
      document.documentElement.style.removeProperty('--text2');
      document.documentElement.style.removeProperty('--text3');
      document.documentElement.style.removeProperty('--text3-hover');
      document.documentElement.style.removeProperty('--sq-text');
      document.documentElement.style.removeProperty('--sq-text-hover');
    }

    if (textColor) {
      document.documentElement.style.setProperty('--sq-text', `var(--${textColor})`);
    }
    else {
      document.documentElement.style.removeProperty('--sq-text');
    }
  }

  setColorVariants900(color: string, name: ColorVariants) {
    // variants from 100-400
    for (let index = 1; index < 5; index++) {
      const value = RGBAToHexA(tintColor(color, 100 - (20 * index)));
      document.documentElement.style.setProperty(`--${name}-${index * 100}`, value);
    }

    // base variant is 500
    document.documentElement.style.setProperty(`--${name}-500`, color);

    // variants from 500-900
    for (let index = 1; index < 5; index++) {
      const value = RGBAToHexA(shadeColor(color, 20 * index));
      document.documentElement.style.setProperty(`--${name}-${index * 100 + 500}`, value);
    }
  }

  setColorVariants(color: string, name: ColorVariants) {
    // variants from 100-200
    for (let index = 1; index < 3; index++) {
      const value = RGBAToHexA(tintColor(color, 100 - (20 * index)));
      document.documentElement.style.setProperty(`--${name}-${index * 100}`, value);
    }

    // base variant is 300
    document.documentElement.style.setProperty(`--${name}-300`, color);

    // variants from 400-500
    for (let index = 1; index < 3; index++) {
      const value = RGBAToHexA(shadeColor(color, 20 * index));
      document.documentElement.style.setProperty(`--${name}-${index * 100 + 300}`, value);
    }
  }

  unsetColorVariants(name: ColorVariants) {
    // variants from 100-600
    for (let index = 1; index < 6; index++) {
      document.documentElement.style.removeProperty(`--${name}-${index * 100}`);
    }
  }
}