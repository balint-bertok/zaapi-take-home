# Fidelity pass: demo against app.zaapi.com

Answers: where does the demo differ from the live app, and what was done about it? One row per compared region. Compared side by side at the same viewport (the live window size, see `docs/measurements.md`), values from computed styles and the live DOM. The live account was used read-only: nothing was typed, saved, sent, published, toggled or deleted.

| Page | Region | Live value | Demo value before | Fix | Status |
|---|---|---|---|---|---|
| global | portalled font | system stack (Inter only on main) | Inter on body | Inter on #root | fixed |
| onboarding step2 | all | identical classes/rects | same | - | ok |
| tickets | sidebar list top | y121 | y125 | drop the extra top padding | fixed |
| tickets | sidebar B avatar | 16px circle, inner border, text 12.25 | text 10px | UserAvatar rebuilt (see user avatar) | fixed |
| tickets | + new ticket icon | 15x12 | 18x14 | text-sm on the button | fixed |
| tickets | sort/filter buttons | 32x32 | 28x28 | size-9 | fixed |
| tickets | Unassigned chip icon | 16x16 circle | 14x14 | size-[16px] | fixed |
| tickets | briefcase badge | 16x16 | 14x14 | size-[16px] | fixed |
| tickets | ticket fields divider | #d1dbe3 | #eaecf0 | border colour | fixed |
| tickets | composer height | min 220px | 176 at 701h | min-h-[220px] | fixed |
| tickets | composer AI tool | lottie infinity 24px | ai-symbol 16px | static svg | fixed |
| tickets | contact field values color | #344054 | #1d2939 | gray-700 inputs, gray-800 textareas | fixed |
| tickets | linked conv + button | 28x28 | 25x25 | size-8 | fixed |
| tickets | bubble hover action | 28x28 button op0 | none | inert reply button, shown on hover | fixed |
| tickets | user avatar | outer bg + inner ring, letter text-sm | letter scaled 10px | UserAvatar rebuilt | fixed |
| tickets | header assignee avatar | 20px | 22px | 20 | fixed |
| tickets | reply/comment menu | shadow-md, items 28px rounded-xs, kbd in text-xs span, comments icon | shadow-light, 32px items, message icon | primitive + menu | fixed |
| tickets | comment composer | yellow-50 panel, editor px-3 pt-3 p-2 transparent | white, px-3 header | fixed |  |
| tickets | assign dialog | Unassigned + AI Agent + Balint rows, gray-50 footer px-7 py-4 with arrow kbds | only Balint, thin footer | rewritten | fixed |
| tickets | textarea fields radius | 5.25 | 7 | rounded-md | fixed |
| tickets | pre-onboarding | All (0) + Ready card (Step 5/6) | ticket present | hide tickets until onboarding done | fixed |
| tickets | closed view header | no list menu, no bulk controls, circle-check empty icon | menu + bulk row, plain text | hidden in Closed | fixed |
| tickets | empty list | face-party size-9 gray-200 + gray-300 text | plain gray-400 text | live markup | fixed |
| tickets | no ticket selected | grey bolt image + "Select a customer to open the ticket" | Ready card | NoTicketSelected | fixed |
| ai-ks | filter chips radius | lg (Source type, Created by), md (Integrations) | all md | prop | fixed |
| ai-ks sheet | source type radios | flex gap-4 mt-2 mb-7 | grid mt-3 + mt-6 | live classes | fixed |
| ai-ks sheet | help text colour | gray-500 | gray-600 | gray-500 | fixed |
| ai-ks sheet | download links divider | gap-2, shrink-0 w-px h-4 | gap-3 | live classes | fixed |
| ai-ks sheet | dropzone | rounded-xl h-36 p-4 hover gray-50 | rounded-lg py-7 | live classes | fixed |
| ai-ks sheet | integration avatar | 20px | 17.5px | size-[20px] | fixed |
| ai-ks sheet | integrations popover | w-96 p-4, header, count + select-all, channel group, accounts with checkboxes | w-64 plain list | rebuilt | fixed |
| ai-ks sheet | website state | placeholder https://zaapi.com/features, disclaimer gray-400 | https://, gray-600 | live placeholder and colour | fixed |
| ai-ks sheet | manual input | rich-text editor with toolbar | plain textarea | shared RichTextEditor | fixed |
| ai-scenario | search box | bordered row, far magnifying glass size-4 gray-500, bare input | input with absolute icon | RowSearchBox | fixed |
| ai-scenario sheet | footer gap | section gap-5 | space-y-6 | cards grouped | fixed |
| ai-personality sheet | AI avatar | 24px | 21px | size-[24px] | fixed |
| ai-ks/scenario/personality | list headers + chooser sheet | identical | identical | - | ok |
| ai-test | background | /images/ai-gradient-bg.png, cover, top left | three radial gradients | low-res resampling of the live image | fixed |
| ai-test | account picker | 36px high, 20px avatar, 12px badge; opens searchable account list | 32px, 17.5px avatar, inert | popover added | fixed |
| ai-test | thread, bubbles, composer, callout | identical | identical | - | ok |
| ai lists | pagination | "Showing 1-n of n" once the workspace has its own rows | always "No data" | count prop | fixed |
| ai lists | person avatar | initial on gray with ring | placeholder photo | live markup | fixed |
| all sheets | overlay | plain black/50, no blur | automations and flows sheets used blurred dialog overlay | one shared SheetFrame | fixed |
| shell | rail tooltip | plain: text-sm, shadow-md, no arrow | text-xs with arrow | plain variant | fixed |
| shell | rail, banner, section sidebar, breadcrumb, content card | identical | identical | - | ok |
| tickets | follow-up bookmark (followed) | not observable without changing data | outline glyph in orange | solid glyph from the saved icon bundle | fixed (unverified on live) |
| register | bot check spacing | widget plus inline line-box gap | widget only | gap added | fixed |
| register | referral code expanded | pt-3 wrapper, input without margin | input mt-1.5 | live markup | fixed |
| register | phone country list | Radix select, min-w-32, code + round flag per row, scrolling list of all countries | 220px menu with country names | code + flag rows, pinned countries | fixed |
| register | form, hero, logos, stats | identical | identical | - | ok |
| onboarding | step 1, get-started card | Step 5 and 6 screenshots | same | - | ok |
| all | inert controls | pointer cursor | default cursor | none: the plan marks uncaptured targets inert with a default cursor | waived (plan decision) |
| all | fixture data | the live account's own tickets, sources, automations, flows, token balance, relative dates ("Yesterday") | demo fixtures | none | waived (fixture data) |
| all | loading states | grey veil and top progress bar while data loads | no loading (in-memory store) | none | waived (no network) |
| tickets | no ticket selected image | /images/zaapi-symbol-gray.png | - | logo bolt recoloured to the sampled grey-blue ramp | approximated (asset not saved) |
| tickets | composer | 24-hour window error banner on an old chat | none | none | waived (fixture age) |
| tickets | closed-ticket state | not observable without closing a live ticket | - | none | not compared on live |
| ai-test | background image | live PNG | - | low-resolution resampling of the live image, scaled the same way | approximated (asset not saved) |
| register | phone flags | flag images for every country | Thailand only | other pinned flags drawn as simplified round SVGs; the list stops at the pinned countries | approximated |
| register | phone default country | chosen from the visitor's location | Thailand, as captured | none | waived (capture) |
| register | bot check widget | Cloudflare iframe (not visible without a session here) | drawn "Success!" state without the Cloudflare logo | none | waived (no outbound request, third-party mark) |
| tickets | own sidebar frame | identical to live | identical | left as is | ok |
| ai lists | empty-table header | Step 11 screenshot | same | - | ok |
| ai setup | all pages | no live counterpart (the memo's proposal; the live Enable page was never captured) | intro, persona, scenarios and knowledge in the inbox onboarding's modal frame; test and go live drawn in the app's style from its own cards, radios, test chat and callout | none | waived (ADR 0002) |
