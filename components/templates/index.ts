import { Tpl_Announcement } from "./Announcement";
import { Tpl_Promo }        from "./Promo";
import { Tpl_Quote }        from "./Quote";
import { Tpl_BeforeAfter }  from "./BeforeAfter";
import { Tpl_Showcase }     from "./Showcase";
import { Tpl_Tip }          from "./Tip";
import { Tpl_Question }     from "./Question";
import { Tpl_Carousel }     from "./Carousel";
import type { Template }    from "@/lib/types";

export const TEMPLATES: Template[] = [
  Tpl_Announcement,
  Tpl_Promo,
  Tpl_Quote,
  Tpl_BeforeAfter,
  Tpl_Showcase,
  Tpl_Tip,
  Tpl_Question,
  Tpl_Carousel,
];

export {
  Tpl_Announcement, Tpl_Promo, Tpl_Quote, Tpl_BeforeAfter,
  Tpl_Showcase, Tpl_Tip, Tpl_Question, Tpl_Carousel,
};
