export class dnd4e implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "dnd4e";
    }

    config:string = "DND4EBETA"

    constructor(){
        if(!CONFIG[this.config]){
            this.config = "DND4E"
        }
    }
    async actorRollSkill(actor, skillId): Promise<Roll | null> {
        return await actor.rollSkill(skillId);
    }

    async actorRollAbility(actor, abilityId): Promise<Roll | null> {
        return await actor.rollAbility(abilityId);
    }

    actorCurrenciesGet(actor): Currencies {
        return actor["system"].currency;
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {currency: currencies}});
    }

    actorSheetAddTab(sheet, html, actor, tabData: { id: string, label: string, html: string }, tabBody: string): void {
        if (sheet.tabGroups) {
            this._actorSheetAddTabV2(sheet, tabData, tabBody);
        } else {
            this._actorSheetAddTabV1(html, tabData, tabBody);
        }
    }

    /**
     * dnd4e >= 0.9 (ApplicationV2): tabs are <a data-action="tab" data-group="sheet"> links handled by foundry.
     * The tab is added to the sheet's own group so foundry switches it, and kept active across re-renders.
     */
    _actorSheetAddTabV2(sheet, tabData: { id: string, label: string, html: string }, tabBody: string): void {
        const root = $(sheet.element instanceof HTMLElement ? sheet.element : sheet.element?.[0]);
        const firstTab = root.find('nav.sheet-tabs [data-action="tab"][data-group]').first();
        if (firstTab.length === 0) return;
        const group = firstTab.attr("data-group") as string;
        const nav = firstTab.parent();
        const body = root.find(`.tab[data-group="${group}"]`).first().parent();
        root.find(`[data-group="${group}"][data-tab="${tabData.id}"]`).remove();
        const active = sheet.tabGroups[group] === tabData.id;
        const tabItem = $(`<a data-action="tab" data-group="${group}" data-tab="${tabData.id}" data-tooltip="${tabData.label}">${tabData.html}</a>`);
        const tabContent = $(`<section class="tab flexcol" data-group="${group}" data-tab="${tabData.id}"></section>`);
        if (active) {
            nav.children().removeClass("active");
            body.children(".tab").removeClass("active");
            tabItem.addClass("active");
            tabContent.addClass("active");
        }
        nav.append(tabItem);
        body.append(tabContent);
        tabContent.append(tabBody);
        // beavers-crafting asks for a tab by setting activeTab and calling changeTab with the group "primary" on every
        // render. This sheet names its group differently and foundry keeps the active tab in tabGroups itself,
        // so the request is mapped to the real group and then dropped, or the user could not leave the tab again.
        if (!sheet._bsaDnd4eChangeTab) {
            sheet._bsaDnd4eChangeTab = true;
            const changeTab = sheet.changeTab.bind(sheet);
            sheet.changeTab = (tab, tabGroup, options) => {
                if (tabGroup === "primary" && !("primary" in sheet.tabGroups)) {
                    tabGroup = group;
                    if (sheet.activeTab === tab) delete sheet.activeTab;
                }
                return changeTab(tab, tabGroup, options);
            };
        }
    }

    _actorSheetAddTabV1(html, tabData: { id: string, label: string, html: string }, tabBody: string): void {
        const tabs = $(html).find('nav[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '" title="' + tabData.label + '">' + tabData.html + '</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-body");
        const tabContent = $('<div class="tab flexcol" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    itemSheetReplaceContent(app, html, element): void {
        html.find('.sheet-navigation').remove();
        const sheetBody = html.find('.sheet-body');
        sheetBody.addClass("bsa-dnd4e");
        sheetBody.empty();
        sheetBody.append(element);
    }

    get configSkills(): SkillConfig[] {
        return Object.entries(CONFIG[this.config].skills).map(([key,value]) => {
            return {
                id: key,
                label: game["i18n"].localize(this.config+".Skill" +key.charAt(0).toUpperCase()+key.substring(1))
            };
        });
    }

    get configAbilities(): AbilityConfig[] {
        return Object.entries(CONFIG[this.config].abilities).map(([key,value]) => {
            return {
                id: key,
                label: game["i18n"].localize(this.config+".Ability" +key.charAt(0).toUpperCase()+key.substring(1))
            };
        });
    }

    get configCurrencies(): CurrencyConfig[] {
        return [
            {
                id: "ad",
                factor: 1000000,
                label: game["i18n"].localize(this.config+".CurrencyAD"),
            },
            {
                id: "pp",
                factor: 10000,
                label: game["i18n"].localize(this.config+".CurrencyPP"),
            },
            {
                id: "gp",
                factor: 100,
                label: game["i18n"].localize(this.config+".CurrencyGP"),
            },
            {
                id: "sp",
                factor: 10,
                label: game["i18n"].localize(this.config+".CurrencySP"),
            },
            {
                id: "cp",
                factor: 1,
                label: game["i18n"].localize(this.config+".CurrencyCP"),
            }
        ]
    }

    get configCanRollAbility(): boolean {
        return true;
    }

    get configLootItemType(): string {
        return "loot";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity";
    }

}