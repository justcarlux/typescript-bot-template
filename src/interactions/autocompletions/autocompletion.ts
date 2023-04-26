import { ApplicationCommandOptionChoiceData } from "discord.js";
import Autocompletion from "../../structures/Autocompletion";

export default new Autocompletion({
    name: "autocompletion",
    for: [
        { name: "command3", focusedOption: "option" }
    ],
    async run(client, interaction) {
        const items: ApplicationCommandOptionChoiceData[] = [
            { name: "Autocompletion Option 1", value: "option1" },
            { name: "Autocompletion Option 2", value: "option2" },
            { name: "Autocompletion Option 3", value: "option3" },
            { name: "Autocompletion Option 4", value: "option4" },
            { name: "Autocompletion Option 5", value: "option5" },
            { name: "Autocompletion Option 6", value: "option6" },
            { name: "Autocompletion Option 7", value: "option7" },
            { name: "Autocompletion Option 8", value: "option8" },
            { name: "Autocompletion Option 9", value: "option9" },
            { name: "Autocompletion Option 10", value: "option10" },
        ]
        return await interaction.respond(
            items.filter(e => {
                return e.name.toLowerCase().includes(interaction.options.getFocused(false).toLowerCase())
            })
        )
    },
})