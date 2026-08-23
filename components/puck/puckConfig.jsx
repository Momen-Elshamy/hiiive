import { HeroBlock } from "../pages/Home/HeroBlock";
import { ContentBlock } from "../pages/Home/ContentBlock";
import { HeaderBlock } from "../layout/HeaderBlock";
import { FooterBlock } from "../layout/FooterBlock";
import { HeadingBlock } from "../ui/HeadingBlock";
import { TextBlock } from "../ui/TextBlock";
import { SpacerBlock } from "../ui/SpacerBlock";
import { ArticleHeroBlock } from "../pages/article/ArticleHeroBlock";
import { ArticleBodyBlock } from "../pages/article/ArticleBodyBlock";
import { ArticleMetaBlock } from "../pages/article/ArticleMetaBlock";
import {
   HomeHeroBlock,
   HomeClientsBlock,
   HomeStatsBlock,
   HomePillarsBlock,
   HomeProcessBlock,
   HomeWorkBlock,
   HomeCtaBlock,
} from "../pages/Home/homeBlocks";
import { StudioHeroBlock, StudioServicesBlock } from "../pages/Studio/studioBlocks";
import {
   DpHeroBlock,
   DpProblemBlock,
   DpMeetBlock,
   DpHowBlock,
   DpFeatureBlock,
   DpResultsBlock,
   DpCasesBlock,
   DpPackagesBlock,
   DpFaqBlock,
} from "../pages/Studio/digitalPresenceBlocks";
import {
   OvHeroBlock,
   OvProblemBlock,
   OvSystemBlock,
   OvPhasesBlock,
} from "../pages/Studio/organicVisibilityBlocks";
import {
   MvpHeroBlock,
   MvpProblemBlock,
   MvpSprintBlock,
   MvpCompareBlock,
   MvpAllInBlock,
} from "../pages/Studio/mvpBlocks";
import { ToolHeroBlock, ToolMethodBlock, EstimatorBlock } from "../pages/Studio/estimatorBlocks";
import {
   CaseStudyHeroBlock,
   CaseStudyListBlock,
   WorkHeaderBlock,
   WorkFeaturedBlock,
   WorkGridBlock,
} from "../pages/Studio/caseStudyBlocks";
import {
   AboutHeroBlock,
   AboutFlywheelBlock,
   AboutPrinciplesBlock,
   AboutHiveBlock,
   AboutTeamBlock,
} from "../pages/About/aboutBlocks";
import { SeoContentBlock } from "../ui/SeoContentBlock";
import { VideoBlock } from "../ui/VideoBlock";
import { ImprintBlock } from "../pages/legal/ImprintBlock";

/**
 * Shared Puck component config.
 *
 * Imported by:
 *  - AdminPageEditor (client, editor mode)
 *  - Home page (server, <Render> mode)
 *
 * Keep render functions free of client-only APIs so they work in RSC.
 */

export const baseBlocks = {
   HeroBlock,
   ContentBlock,
   HeaderBlock,
   FooterBlock,
   HeadingBlock,
   TextBlock,
   SpacerBlock,
   ArticleHeroBlock,
   ArticleBodyBlock,
   ArticleMetaBlock,
   HomeHeroBlock,
   HomeClientsBlock,
   HomeStatsBlock,
   HomePillarsBlock,
   HomeProcessBlock,
   HomeWorkBlock,
   HomeCtaBlock,
   StudioHeroBlock,
   StudioServicesBlock,
   DpHeroBlock,
   DpProblemBlock,
   DpMeetBlock,
   DpHowBlock,
   DpFeatureBlock,
   DpResultsBlock,
   DpCasesBlock,
   DpPackagesBlock,
   DpFaqBlock,
   OvHeroBlock,
   OvProblemBlock,
   OvSystemBlock,
   OvPhasesBlock,
   MvpHeroBlock,
   MvpProblemBlock,
   MvpSprintBlock,
   MvpCompareBlock,
   MvpAllInBlock,
   ToolHeroBlock,
   ToolMethodBlock,
   EstimatorBlock,
   AboutHeroBlock,
   AboutFlywheelBlock,
   AboutPrinciplesBlock,
   AboutHiveBlock,
   AboutTeamBlock,
   SeoContentBlock,
   VideoBlock,
   CaseStudyHeroBlock,
   CaseStudyListBlock,
   WorkHeaderBlock,
   WorkFeaturedBlock,
   WorkGridBlock,
   ImprintBlock,
};

export const baseCategories = {
   homepage: {
      title: "Homepage",
      components: [
         "HomeHeroBlock",
         "HomeClientsBlock",
         "HomeStatsBlock",
         "HomePillarsBlock",
         "HomeProcessBlock",
         "HomeWorkBlock",
         "HomeCtaBlock",
      ],
      defaultExpanded: true,
   },
   home: {
      title: "Home",
      components: ["HeroBlock", "ContentBlock"],
      defaultExpanded: true,
   },
   studio: {
      title: "Studio",
      components: ["StudioHeroBlock", "StudioServicesBlock"],
      defaultExpanded: true,
   },
   "case-studies": {
      title: "Case Studies",
      components: ["CaseStudyHeroBlock", "CaseStudyListBlock", "WorkHeaderBlock", "WorkFeaturedBlock", "WorkGridBlock"],
   },
   tools: {
      title: "Tools",
      components: ["ToolHeroBlock", "EstimatorBlock", "ToolMethodBlock"],
   },
   "studio-mvp": {
      title: "Studio · MVP Build",
      components: ["MvpHeroBlock", "MvpProblemBlock", "MvpSprintBlock", "MvpCompareBlock", "MvpAllInBlock"],
   },
   "studio-organic-visibility": {
      title: "Studio · Organic Visibility",
      components: ["OvHeroBlock", "OvProblemBlock", "OvSystemBlock", "OvPhasesBlock"],
   },
   "studio-digital-presence": {
      title: "Studio · Digital Presence",
      components: [
         "DpHeroBlock",
         "DpProblemBlock",
         "DpMeetBlock",
         "DpHowBlock",
         "DpFeatureBlock",
         "DpResultsBlock",
         "DpCasesBlock",
         "DpPackagesBlock",
         "DpFaqBlock",
      ],
   },
   about: {
      title: "About",
      components: ["AboutHeroBlock", "AboutFlywheelBlock", "AboutPrinciplesBlock", "AboutHiveBlock", "AboutTeamBlock"],
   },
   global: {
      title: "Global",
      components: ["HeaderBlock", "FooterBlock"],
      defaultExpanded: true,
   },
   template: {
      title: "Template",
      components: ["ArticleHeroBlock", "ArticleBodyBlock", "ArticleMetaBlock"],
      defaultExpanded: true,
   },
   legal: {
      title: "Legal",
      components: ["ImprintBlock"],
      defaultExpanded: true,
   },
   other: {
      title: "Primitives",
      components: ["HeadingBlock", "TextBlock", "SpacerBlock", "SeoContentBlock", "VideoBlock"],
   },
};

export const puckConfig = {
   categories: baseCategories,
   components: baseBlocks,
};
