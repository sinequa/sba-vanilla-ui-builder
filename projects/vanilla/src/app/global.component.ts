import { Component, Input, OnChanges } from "@angular/core";

import { hexToHSL, hexToRGBA, RGBAToHexA, shadeColor, tintColor } from "./colors";

type ColorVariants = "primary" | "secondary" | "brand";

@Component({
  selector: 'sq-global',
  template: ``
})
export class GlobalComponent implements OnChanges {
  @Input() backgroundColor?: string;
  @Input() gradientColor?: string;
  @Input() backgroundImage?: string;
  @Input() fontFamily?: string;
  @Input() brandingColor?: string;
  @Input() primaryColor?: string;
  @Input() secondaryColor?: string;
  @Input() textColor?: string;


  ngOnChanges(): void {

    if(this.fontFamily) {
      document.documentElement.style.setProperty('--bs-body-font-family', this.fontFamily);
    }
    else {
      document.documentElement.style.removeProperty("--bs-body-font-family");
    }

    if(this.backgroundImage) {
      document.body.style.backgroundImage = `url(${this.backgroundImage})`;
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

    if(!this.backgroundImage && this.backgroundColor) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor);
    }
    else {
      document.documentElement.style.removeProperty('--background-color');
    }

    if(!this.backgroundImage && this.gradientColor) {
      document.documentElement.style.setProperty('--gradient-color', this.gradientColor);
    }
    else {
      document.documentElement.style.removeProperty('--gradient-color');
    }

    if (this.primaryColor) {
      this.setColorVariants(this.primaryColor, "primary");
      document.documentElement.style.setProperty('--primary', `var(--primary-300)`);
      const [r, g, b] = hexToRGBA(this.primaryColor);
      document.documentElement.style.setProperty('--primary-rgb',`${r},${g},${b}` );
    }
    else {
      this.unsetColorVariants("primary");
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-rgb');
    }

    if (this.secondaryColor) {
      this.setColorVariants(this.secondaryColor, "secondary");
      document.documentElement.style.setProperty('--secondary', `var(--secondary-300)`);
      const [r, g, b] = hexToRGBA(this.secondaryColor);
      document.documentElement.style.setProperty('--secondary-rgb',`${r},${g},${b}` );
    }
    else {
      this.unsetColorVariants("secondary");
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--secondary-rgb');
    }

    if (this.brandingColor) {
      const [h, s, l] = hexToHSL(this.brandingColor);

      document.documentElement.style.setProperty('--brand-hue', `${h}`);
      document.documentElement.style.setProperty('--brand-saturation', `${s}%`);
      document.documentElement.style.setProperty('--brand-lightness', `${l}%`);

      this.setColorVariants(this.brandingColor, "brand");
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

    if (this.textColor) {
      document.documentElement.style.setProperty('--sq-text', `var(--${this.textColor})`);
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
    // variants from 100-200
    for (let index = 1; index < 3; index++) {
      document.documentElement.style.removeProperty(`--${name}-${index * 100}`);
    }

    // base variant is 300
    document.documentElement.style.removeProperty(`--${name}-300`);

    // variants from 400-500
    for (let index = 1; index < 3; index++) {
      document.documentElement.style.removeProperty(`--${name}-${index * 100 + 300}`);
    }
  }
}
