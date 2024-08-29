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