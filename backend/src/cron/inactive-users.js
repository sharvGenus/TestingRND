const { Op, Sequelize } = require("sequelize");
const scheduler = require("node-schedule");
const {
    getMasterMakerLovByCondition
} = require("../app/master-maker-lovs/master-maker-lovs.service");
const { getAllUsers, updateUser } = require("../app/users/users.service");
const Tickets = require("../database/operation/tickets");
const { updateTicket } = require("../app/tickets/tickets.service");

const task = async () => {
    // scheduler.scheduleJob("30 0 * * *", async () => {
        // works at 00:30AM
        try {
            const { name } = await getMasterMakerLovByCondition({
                id: "bb767b94-8e19-4637-b281-2d0afa32ced6"
            });

            if (name) {
                // const users = new Users();
                const condition = {
                    isActive: "1",
                    [Op.or]: [
                        {
                            [Op.and]: [
                                {
                                    lastLogin: {
                                        [Op.lte]: Sequelize.literal(
                                            `CURRENT_DATE - INTERVAL '${name} days'`
                                        )
                                    }
                                },
                                {
                                    lastLogin: {
                                        [Op.ne]: null
                                    }
                                }
                            ]
                        },
                        {
                            [Op.and]: [
                                {
                                    dateOfOnboarding: {
                                        [Op.lte]: Sequelize.literal(
                                            `CURRENT_DATE - INTERVAL '${name} days'`
                                        )
                                    }
                                },
                                {
                                    lastLogin: { [Op.is]: null }
                                }
                            ]
                        }
                    ]
                };

                const { rows } = await getAllUsers(
                    condition,
                    false,
                    ["id"],
                    undefined,
                    true
                );
                const inactiveUserIds = rows.map((user) => user.id);
                await updateUser(
                    { isActive: "0", updatedAt: Date.now(), status: "40e66f7e-4088-4bd1-a555-c5b867b101c9" },
                    { id: inactiveUserIds }
                );

                // Handling H&T Impact
                const tickets = new Tickets();
                const ticketCondition = {
                    ticketStatus: { [Op.not]: "closed" },
                    [Op.or]: [
                        { supervisorId: { [Op.in]: inactiveUserIds } },
                        { assigneeId: { [Op.in]: inactiveUserIds } }
                    ]
                };
                let inactiveUserRelatedTickets = await tickets.findAll(
                    ticketCondition,
                    [
                        "id",
                        "supervisorId",
                        "assigneeId",
                        "ticketStatus",
                        "assigneeType"
                    ]
                );
                inactiveUserRelatedTickets = JSON.parse(
                    JSON.stringify(inactiveUserRelatedTickets)
                );
                inactiveUserRelatedTickets.forEach((ticket) => {
                    const supervisorFlag = inactiveUserIds.includes(
                        ticket.supervisorId
                    );
                    const installerFlag = inactiveUserIds.includes(
                        ticket.assigneeId
                    );
                    // Check ticket is assigned to supervisor and installer
                    if (ticket.supervisorId && ticket.assigneeId) {
                        // check if both supervisor and installer are getting deactivated
                        if (supervisorFlag && installerFlag) {
                            // Ticket will be moved to NOMC
                            ticket.supervisorId = null;
                            ticket.assigneeId = null;
                            ticket.ticketStatus = "open";
                            ticket.assigneeType = "nomc";
                        } else if (supervisorFlag) {
                            // Supervisor will be removed from ticket
                            ticket.supervisorId = null;
                            ticket.assigneeType = "installer";
                            ticket.ticketStatus = "assigned";
                        } else if (installerFlag) {
                            // Ticket will be assigned back to supervisor
                            ticket.assigneeId = ticket.supervisorId;
                            ticket.assigneeType = "supervisor";
                            ticket.ticketStatus = "assigned";
                        }
                    } else {
                        // Check ticket is assigned to either installer or supervisor
                        // Ticket will be moved to NOMC
                        ticket.supervisorId = null;
                        ticket.assigneeId = null;
                        ticket.ticketStatus = "open";
                        ticket.assigneeType = "nomc";
                    }
                });

                const batchSize = 10;
                const totalBatches = Math.ceil(
                    inactiveUserRelatedTickets.length / batchSize
                );

                for (let i = 0; i < totalBatches; i++) {
                    const start = i * batchSize;
                    const end = (i + 1) * batchSize;

                    try {
                        // eslint-disable-next-line no-await-in-loop
                        await Promise.all(
                            inactiveUserRelatedTickets
                                .slice(start, end)
                                .map((ticket) => updateTicket(ticket, "577b8900-b333-42d0-b7fb-347abc3f0b5c", { id: ticket.id }))
                        );
                    } catch (error) {
                        console.error(`Error in batch ${i + 1}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error("Error executing the isactive user cron job:", error);
        }
    // });
};

module.exports = { task };
