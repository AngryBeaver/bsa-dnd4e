export class dnd4e implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "dnd4e";
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
        var properties = html.find('.item-properties').clone();
        const sheetBody = html.find('.sheet-body');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(properties);
        sheetBody.append(element);
    }

    get configSkills(): SkillConfig[] {
        return Object.entries(CONFIG["DND4EBETA"].skills).map(([key,value]) => {
            return {
                id: key,
                label: game["i18n"].localize("DND4EBETA.Skill"  +key.toUpperCase())
            };
        });
    }

    get configAbilities(): AbilityConfig[] {
        return Object.entries(CONFIG["DND4EBETA"].abilities).map(([key,value]) => {
            return {
                id: key,
                label: game["i18n"].localize("DND4EBETA.Ability" +key.toUpperCase())
            };
        });
    }

    get configCurrencies(): CurrencyConfig[] {
        return [
            {
                id: "ad",
                factor: 1000000,
                label: game["i18n"].localize("DND4EBETA.CurrencyAD"),
            },
            {
                id: "pp",
                factor: 10000,
                label: game["i18n"].localize("DND4EBETA.CurrencyPP"),
            },
            {
                id: "gp",
                factor: 100,
                label: game["i18n"].localize("DND4EBETA.CurrencyGP"),
            },
            {
                id: "sp",
                factor: 10,
                label: game["i18n"].localize("DND4EBETA.CurrencySP"),
            },
            {
                id: "cp",
                factor: 1,
                label: game["i18n"].localize("DND4EBETA.CurrencyCP"),
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