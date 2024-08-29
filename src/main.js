import {dnd4e} from "./Dnd4e.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new dnd4e());
});

Hooks.on("beavers-system-interface.ready", async function(){
    import("./SkillTest.js")
    import("./AbilityTest.js")
});
