import Modal from "../../structures/Modal";

export default new Modal({
    name: "modal",
    async run(client, interaction) {
        return await interaction.reply({ content: `Test modal input value: ${
            interaction.fields.getTextInputValue("input")
        }`, ephemeral: true });
    },
})