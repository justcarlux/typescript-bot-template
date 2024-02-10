import Button from "../../structures/modules/interactions/Button";

export default new Button({
    name: "button",
    async run(client, interaction) {
        return await interaction.reply({
            content: "Button",
            ephemeral: true
        })
    },
})