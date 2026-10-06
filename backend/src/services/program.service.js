const { QueryTypes } = require('sequelize');

let DataProvider = {

  getProgramddList: async () => {
    return new Promise(async function (resolve, reject) {      
      await conn.Programs.findAndCountAll({
        attributes: ["id", "name", "title"],
        where: { status:1 },
        order: [ ['name', 'ASC']],
        // raw: true,
        // logging:console.log
      })
        .then(async data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  getHomePageProgramList: async (showRecord = true) => {
    return new Promise(async function (resolve, reject) {
      let columns = ["id", "name", "title", "shortDesc", "fileUrl"];  
      let filter = { status: 1 };
      if(showRecord){
        filter = {...filter, showRecord : 1 }
      }      
      await conn.Programs.findAll({
        attributes:columns,
        where: filter,
        include: [
            {
                model: conn.ProgramTypes,
                attributes: ["id", "name"],
                required: true,
            }
        ],
        order: [ ['id', 'DESC']],
        raw: true,
        // logging:console.log
      })
        .then(async data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  getProgramDetailsById: async (programId) => {
    const program = await conn.Programs.findOne({
            where: {
                id: programId,
                status: 1
            },
            include: [
                {
                    model: conn.ProgramTypes,
                    attributes: ["id", "name"],
                    required: true,
                },
                {
                    model: conn.ProgramNeeds,
                    required: false,
                    where: {
                        status: 1
                    },
                    order: [
                        ["id", "ASC"]
                    ]
                },
                {
                    model: conn.Mentors,
                    required: false,
                    where: {
                        status: 1, isdeleted:0
                    },
                    order: [
                        ["id", "ASC"]
                    ]
                }
            ]
    });
    if (!program) {
        return null;
    }

    const data = program.get({plain: true});
    return data;
  },
  
  getProgramList: async (all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = {  };
      let columns = ["id", "name", "title", "shortDesc", "fileUrl", "remarks",  "status", "createdAt"];
      if(!all){
        columns = ["id", "name", "title", "shortDesc", "fileUrl", "remarks"];
        filter = {...filter, status:1}
      }
      await conn.Programs.findAndCountAll({
        attributes:columns,
        where: filter,
        include: [
            {
                model: conn.ProgramTypes,
                attributes: ["id", "name"],
                required: true,
            }
        ],
        order: [ ['id', 'DESC']],
        // raw: true,
        // logging:console.log
      })
        .then(async data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  createProgramWithNeeds: async (programData,needsData = []) => {

        const transaction = await conn.sequelize.transaction();

        try {
            const program = await conn.Programs.create(programData,{ transaction, logging: console.log } );

            // -----------------------------------------
            // Create Program Needs
            // -----------------------------------------

            if (needsData.length > 0) {

                const programNeeds = needsData.map((need) => ({...need, programId: program.id }));

                await conn.ProgramNeeds.bulkCreate(programNeeds, {transaction, validate: true, logging: console.log} );
            }

            await transaction.commit();

            return {
                ...program.get({ plain: true }),
                ProgramNeeds: needsData.map((need) => ({
                    ...need,
                    programId: program.id
                }))
            };

        } catch (error) {
            await transaction.rollback();

            console.error("createProgramWithNeeds service error:", error);
            throw error;
        }
    },
  createProgramWithNeedsLog: async (programData, needsData = []) => {
    try {
        const result = await conn.sequelize.transaction(async (transaction) => {

        let program;

        try {
            program = await conn.Programs.create(programData, {
            transaction,
            logging: console.log
            });
        } catch (error) {
            console.error("PROGRAM INSERT FAILED");
            console.error({
            message: error.message,
            parentMessage: error.parent?.message,
            code: error.parent?.code,
            detail: error.parent?.detail,
            hint: error.parent?.hint,
            table: error.parent?.table,
            column: error.parent?.column,
            constraint: error.parent?.constraint
            });

            throw error;
        }

        let programNeeds = [];
        const now = new Date();

        if (needsData.length > 0) {
            programNeeds = needsData.map((need) => ({
            title: need.title || '',
            fileUrl: need.fileUrl || '',
            remarks: need.remarks || '',
            programId: program.id,
            createdBy: need.createdBy,
            createdAt: now,
            }));

            try {
            await conn.ProgramNeeds.bulkCreate(programNeeds, {
                transaction,
                validate: true,
                logging: console.log
            });
            } catch (error) {
            console.error("PROGRAM NEEDS INSERT FAILED");
            console.error({
                message: error.message,
                parentMessage: error.parent?.message,
                code: error.parent?.code,
                detail: error.parent?.detail,
                hint: error.parent?.hint,
                table: error.parent?.table,
                column: error.parent?.column,
                constraint: error.parent?.constraint
            });

            throw error;
            }
        }

        return {
            program,
            programNeeds
        };
        });

        return {
        ...result.program.get({ plain: true }),
        ProgramNeeds: result.programNeeds
        };

    } catch (error) {
        console.error("createProgramWithNeeds service error:", error);
        throw error;
    }
    },

  checkExistProgram: async (name, title, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.Programs.findOne({
        where: { 
          name : name.trim(),  
        //   title: title.trim(),          
          id: { [Op.not]: id }       
        },
      })
        .then(data => {
          if (data == null) {
            resolve(false);
          } else if (id && data.length == 1) {
            resolve(false);
          } else {
            resolve(true);
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  getProgramById: async (programId) => {
    const program = await conn.Programs.findOne({
            where: {
                id: programId,
                status: 1
            },
            include: [
                {
                    model: conn.ProgramTypes,
                    attributes: ["id", "name"],
                    required: true,
                },
                {
                    model: conn.ProgramNeeds,
                    required: false,
                    where: {
                        status: 1
                    },
                    order: [
                        ["id", "ASC"]
                    ]
                }
            ]
    });
    if (!program) {
        return null;
    }

    const data = program.get({plain: true});
    return data;
  },
  updateProgram: async (body) => {
        const transaction = await conn.sequelize.transaction();

        try {
            const programId = parseInt(body.id);
            const program = await conn.Programs.findOne({
                    where: {
                        id: programId,
                        status: 1
                    },
                    transaction
                });

            if (!program) {
                throw new Error("Program not found.");
            }

            // ------------------------------------------
            // 2. Update Program
            // ------------------------------------------

            await program.update(
                {
                    programTypeId: body.programTypeId,
                    name: body.name.trim(),

                    shortDesc:
                        body.shortDesc || "",

                    title:
                        body.title.trim(),

                    remarks:
                        body.remarks || "",

                    fileUrl:
                        body.fileUrl || "",

                    impactHeading:
                        body.impactHeading ||
                        "",

                    impactTitle:
                        body.impactTitle ||
                        "",

                    impactFileUrl:
                        body.impactFileUrl ||
                        "",

                    impactDescription:
                        body.impactDescription ||
                        "",

                    joinTitle:
                        body.joinTitle || "",

                    joinFileUrl:
                        body.joinFileUrl ||
                        "",

                    joinDescription:
                        body.joinDescription ||
                        ""
                }, { transaction }
            );

            // ------------------------------------------
            // 3. Existing Needs
            // ------------------------------------------

            const existingNeeds =
                await conn.ProgramNeeds.findAll({
                    where: {
                        programId
                    },
                    transaction
                });

            const existingIds =
                existingNeeds.map(
                    (need) =>
                        Number(need.id)
                );

            const incomingNeeds = Array.isArray(body.programNeeds) ? body.programNeeds : [];

            const incomingIds = incomingNeeds.filter((need) =>need.id).map((need) =>Number(need.id));

            // ------------------------------------------
            // 4. Delete removed Needs
            // ------------------------------------------

            const idsToDelete = existingIds.filter((id) =>!incomingIds.includes(id));

            if (idsToDelete.length > 0) {
                await conn.ProgramNeeds.destroy({
                    where: { 
                        programId, 
                        id: { [conn.Sequelize.Op.in]: idsToDelete}
                    },
                    transaction
                });
            }

            // ------------------------------------------
            // 5. Update / Create Needs
            // ------------------------------------------

            for (const need of incomingNeeds) {
                if ( need.id && existingIds.includes( Number(need.id) ) ) {
                    // ------------------------------
                    // Existing Need
                    // ------------------------------

                    await conn.ProgramNeeds.update(
                        {
                            title: need.title || "",

                            fileUrl: need.fileUrl || "",

                            remarks: need.remarks || ""
                        },
                        {
                            where: {
                                id: Number(need.id),
                                programId
                            },
                            transaction
                        }
                    );
                } else {
                    // ------------------------------
                    // New Need
                    // ------------------------------

                    await conn.ProgramNeeds.create(
                        {
                            programId,
                            title: need.title || "",
                            fileUrl: need.fileUrl || "",
                            remarks: need.remarks || "",
                            status: 1
                        },
                        {
                            transaction
                        }
                    );
                }
            }

            // ------------------------------------------
            // 6. Commit
            // ------------------------------------------

            await transaction.commit();

            return {
                id: programId
            };

        } catch (error) {
            // ------------------------------------------
            // Rollback
            // ------------------------------------------

            await transaction.rollback();

            console.error("updateProgram transaction error:", error);

            throw error;
        }
    },
  
  //Use this service to edit purpose
  changeProgramStatus: async (body, programId) => {
    return new Promise(function (resolve, reject) {
      conn.Programs.update( body, {
        where: { id: programId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  
};
module.exports = DataProvider;
