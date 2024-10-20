import Button from "../../structures/modules/interactions/Button";

export default new Button({
    name: "button",
    async run(_, interaction) {
        return await interaction.reply({
            content: "Button",
            ephemeral: true
        });
    }
});
