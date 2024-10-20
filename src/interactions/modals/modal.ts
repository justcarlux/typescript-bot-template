import Modal from "../../structures/modules/interactions/Modal";

export default new Modal({
    name: "modal",
    async run(_, interaction) {
        return await interaction.reply({
            content: `Test modal input value: ${interaction.fields.getTextInputValue(
                "input"
            )}`,
            ephemeral: true
        });
    }
});
