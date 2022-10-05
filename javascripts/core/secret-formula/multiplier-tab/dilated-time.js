import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.DT = {
  total: {
    name: "Dilated Time gain",
    displayOverride: () => `${format(getDilationGainPerSecond().times(getGameSpeedupForDisplay()), 2, 2)}/sec`,
    multValue: () => getDilationGainPerSecond().times(getGameSpeedupForDisplay()),
    isActive: () => getDilationGainPerSecond().gt(0),
    dilationEffect: () => (Enslaved.isRunning ? 0.85 : 1),
    overlay: ["Ψ"],
  },
  tachyon: {
    name: "Tachyon Particles",
    displayOverride: () => {
      const baseTPStr = format(new Decimal(Currency.tachyonParticles.value), 2, 2);
      return PelleRifts.paradox.milestones[1].canBeApplied
        ? `${baseTPStr}${formatPow(PelleRifts.paradox.milestones[1].effectValue, 1)}`
        : baseTPStr;
    },
    multValue: () => new Decimal(Currency.tachyonParticles.value)
      .pow(PelleRifts.paradox.milestones[1].effectOrDefault(1)),
    isActive: () => getDilationGainPerSecond().gt(0),
    icon: MultiplierTabIcons.TACHYON_PARTICLES,
  },
  achievement: {
    name: "Achievements",
    multValue: () => Achievement(132).effectOrDefault(1) * Achievement(137).effectOrDefault(1),
    isActive: () => Achievement(132).canBeApplied || Achievement(137).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  dilation: {
    name: "Repeatable Dilation Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ),
    isActive: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ).gt(1),
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  gamespeed: {
    name: "Current Game speed",
    multValue: () => getGameSpeedupForDisplay(),
    isActive: () => getGameSpeedupForDisplay() > 1,
    icon: MultiplierTabIcons.GAMESPEED,
  },
  realityUpgrade: {
    name: "Temporal Amplifier",
    multValue: () => RealityUpgrade(1).effectOrDefault(1),
    isActive: () => RealityUpgrade(1).canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  glyph: {
    name: "Glyph Effects",
    multValue: () => Decimal.times(getAdjustedGlyphEffect("dilationDT"),
      Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1))
      .times(Pelle.specialGlyphEffect.dilation),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH
  },
  ra: {
    name: "Ra Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      Ra.unlocks.continuousTTBoost.effects.dilatedTime,
      Ra.unlocks.peakGamespeedDT
    ),
    isActive: () => Ra.unlocks.autoTP.canBeApplied,
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  alchemy: {
    name: "Glyph Alchemy",
    multValue: () => AlchemyResource.dilation.effectOrDefault(1),
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: () => new Decimal(ShopPurchase.dilatedTimePurchases.currentMult ** (Pelle.isDoomed ? 0.5 : 1)),
    isActive: () => player.IAP.totalSTD > 0,
    icon: MultiplierTabIcons.IAP,
  },

  nerfV: {
    name: "V's Reality",
    powValue: () => 0.5,
    isActive: () => V.isRunning,
    icon: MultiplierTabIcons.GENERIC_V,
  },
  nerfPelle: {
    name: "Doomed Nerfs",
    multValue: 1e-5,
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  }
};
