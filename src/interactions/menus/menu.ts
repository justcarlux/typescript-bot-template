import SelectMenu from "../../structures/Menu";

export default new SelectMenu({
    name: "menu",
    async run(client, interaction) {
        return await interaction.reply({
            content: `You selected: ${interaction.values[0]}`,
            ephemeral: true
        })
    },
})