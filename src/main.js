import {dnd4e} from "./Dnd4e.ts";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new dnd4e());
});
