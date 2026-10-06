const { QueryTypes } = require('sequelize');
let DataProvider = {

  getPageData: async (type, all = false) => {
    return new Promise(async function (resolve, reject) {
      let filter = { status: 1, name: type };
      
      await conn.PageMasters.findAndCountAll({
        where: filter,
        include: [
          {
            model: conn.PageBanners,
            attributes: ['id', 'pageId', 'type', 'fileUrl'],
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageAbouts,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageMaps,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageVideos,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageZigZags,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageFeatures,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageValues,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageFounders,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageTeams,
            where: { status: 1},
            required: false
          },
        ],
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
  ////////////////Edit PageMaster////////////////////
  updatePageMaster: async (body, pageId) => {
    return new Promise(function (resolve, reject) {
      conn.PageMasters.update(body, {
        where: { id: pageId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },

  ///////Page Banner service //////////////
  addBanner: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageBanners.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editBanner: async (bannerId, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageBanners.update(body, {
        where: { id: bannerId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page Banner  ////////////////

  ///////Page Map service //////////////
  addPagemap: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageMaps.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editPagemap: async (id, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageMaps.update(body, {
        where: { id: id },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page Map  ////////////////

  ///////Page About service //////////////
  addPageabout: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageAbouts.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editPageabout: async (id, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageAbouts.update(body, {
        where: { id: id },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page About  ////////////////
  
  ///////Page Video service //////////////
  addPagevideo: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageVideos.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editPagevideo: async (videoId, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageVideos.update(body, {
        where: { id: videoId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page Video  ////////////////

  ///////Page ZigZag service //////////////
  saveZigZag: async (body, request) => {
      const transaction = await conn.sequelize.transaction();

      try {
        const {
          pageId,
          zigzagTitle,
          items = [],
          deletedIds = [],
        } = body;

        const userId = request.user?.userId || null;

        // --------------------------------------
        // Validate page
        // --------------------------------------

        const page = await conn.PageMasters.findOne({
          where: {
            id: pageId,
            status: 1,
          },
          transaction,
        });

        if (!page) {
          throw new Error("Home page record not found.");
        }

        // --------------------------------------
        // Update PageMasters
        // --------------------------------------

        await conn.PageMasters.update(
          {
            zigzagTitle: zigzagTitle?.trim() || null,
            updatedBy: userId,
          },
          { where: { id: pageId }, transaction, }
        );

        // --------------------------------------
        // Delete removed rows
        // --------------------------------------

        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          await conn.PageZigZags.update(
            {
              status: 0,
              updatedBy: userId,
            },
            {
              where: {
                id: {
                  [conn.Sequelize.Op.in]:
                    deletedIds,
                },
                pageId,
              },
              transaction,
            }
          );
        }

        // --------------------------------------
        // Create / Update
        // --------------------------------------

        const savedItems = [];

        for (const item of items) {

          const itemData = {
            pageId,
            fileUrl: item.fileUrl,
            remarks: item.remarks || "",
            orderNumber: item.orderNumber,
            status: 1,
            updatedBy: userId,
          };

          if (item.id && Number(item.id) > 0) {

            const [updatedCount] = await conn.PageZigZags.update(
                itemData,
                {
                  where: {
                    id: item.id,
                    pageId,
                  },
                  transaction,
                }
              );

            if (updatedCount === 0) {
              throw new Error( `Zig-Zag item ${item.id} not found.`);
            }

            savedItems.push({id: item.id,...itemData,});

          } else {

            const created = await conn.PageZigZags.create(
                {...itemData, createdBy: userId, }, {transaction,}
              );

            savedItems.push(created);
          }
        }

        // --------------------------------------
        // Commit
        // --------------------------------------

        await transaction.commit();

        return { zigzagTitle: zigzagTitle?.trim() || "", items: savedItems,};

      } catch (error) {

        await transaction.rollback();

        console.error("saveZigZag service error:",error);

        throw error;
      }
  },
  ///////End Page ZigZag //////////////
  
  ///////Page Feature service //////////////
  saveFeature: async (body, request) => {
      const transaction = await conn.sequelize.transaction();

      try {
        const {
          pageId,
          items = [],
          deletedIds = [],
        } = body;

        const userId = request.user?.userId || null;

        // --------------------------------------
        // Validate page
        // --------------------------------------

        const page = await conn.PageMasters.findOne({
          where: {
            id: pageId,
            status: 1,
          },
          transaction,
        });

        if (!page) {
          throw new Error("Page record not found.");
        }

        // --------------------------------------
        // Delete removed rows
        // --------------------------------------

        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          await conn.PageFeatures.update(
            {
              status: 0,
              updatedBy: userId,
            },
            {
              where: {
                id: {
                  [conn.Sequelize.Op.in]:
                    deletedIds,
                },
                pageId,
              },
              transaction,
            }
          );
        }

        // --------------------------------------
        // Create / Update
        // --------------------------------------

        const savedItems = [];

        for (const item of items) {

          const itemData = {
            pageId,
            title: item.title,
            btnText: item.btnText,
            btnLink: item.btnLink,
            fileUrl: item.fileUrl,
            remarks: item.remarks || "",
            orderNumber: item.orderNumber,
            status: 1,
            updatedBy: userId,
          };

          if (item.id && Number(item.id) > 0) {

            const [updatedCount] = await conn.PageFeatures.update(
                itemData,
                {
                  where: {
                    id: item.id,
                    pageId,
                  },
                  transaction,
                }
              );

            if (updatedCount === 0) {
              throw new Error( `Feature item ${item.id} not found.`);
            }

            savedItems.push({id: item.id,...itemData,});

          } else {

            const created = await conn.PageFeatures.create(
                {...itemData, createdBy: userId, }, {transaction,}
              );

            savedItems.push(created);
          }
        }

        // --------------------------------------
        // Commit
        // --------------------------------------

        await transaction.commit();

        return { items: savedItems,};

      } catch (error) {

        await transaction.rollback();

        console.error("saveFeature service error:",error);

        throw error;
      }
  },
  ///////End Page Feature //////////////
  
  ///////Page Value service //////////////
  savePageValue: async (body, request) => {
      const transaction = await conn.sequelize.transaction();

      try {
        const {
          pageId,
          items = [],
          deletedIds = [],
        } = body;

        const userId = request.user?.userId || null;

        // --------------------------------------
        // Validate page
        // --------------------------------------

        const page = await conn.PageMasters.findOne({
          where: {
            id: pageId,
            status: 1,
          },
          transaction,
        });

        if (!page) {
          throw new Error("Page record not found.");
        }

        // --------------------------------------
        // Delete removed rows
        // --------------------------------------

        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          await conn.PageValues.update(
            {
              status: 0,
              updatedBy: userId,
            },
            {
              where: {
                id: {
                  [conn.Sequelize.Op.in]:
                    deletedIds,
                },
                pageId,
              },
              transaction,
            }
          );
        }

        // --------------------------------------
        // Create / Update
        // --------------------------------------

        const savedItems = [];

        for (const item of items) {

          const itemData = {
            pageId,
            // title: item.title,
            remarks: item.remarks || "",
            orderNumber: item.orderNumber,
            status: 1,
            updatedBy: userId,
          };

          if (item.id && Number(item.id) > 0) {

            const [updatedCount] = await conn.PageValues.update(
                itemData,
                {
                  where: {
                    id: item.id,
                    pageId,
                  },
                  transaction,
                }
              );

            if (updatedCount === 0) {
              throw new Error( `Values item ${item.id} not found.`);
            }

            savedItems.push({id: item.id,...itemData,});

          } else {

            const created = await conn.PageValues.create(
                {...itemData, createdBy: userId, }, {transaction,}
              );

            savedItems.push(created);
          }
        }

        // --------------------------------------
        // Commit
        // --------------------------------------

        await transaction.commit();

        return { items: savedItems,};

      } catch (error) {

        await transaction.rollback();

        console.error("savePageValue service error:",error);

        throw error;
      }
  },
  
  ///////Page Founder service //////////////
  addPagefounder: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageFounders.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editPagefounder: async (id, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageFounders.update(body, {
        where: { id: id },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page Founder  ////////////////

  ///////Page Team service //////////////
  saveTeam: async (body, request) => {
      const transaction = await conn.sequelize.transaction();

      try {
        const {
          pageId,
          items = [],
          deletedIds = [],
        } = body;

        const userId = request.user?.userId || null;

        // --------------------------------------
        // Validate page
        // --------------------------------------

        const page = await conn.PageMasters.findOne({
          where: {
            id: pageId,
            status: 1,
          },
          transaction,
        });

        if (!page) {
          throw new Error("page record not found.");
        }

        // --------------------------------------
        // Delete removed rows
        // --------------------------------------

        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          await conn.PageTeams.update(
            {
              status: 0,
              updatedBy: userId,
            },
            {
              where: {
                id: {
                  [conn.Sequelize.Op.in]:
                    deletedIds,
                },
                pageId,
              },
              transaction,
            }
          );
        }

        // --------------------------------------
        // Create / Update
        // --------------------------------------

        const savedItems = [];

        for (const item of items) {

          const itemData = {
            pageId,
            fileUrl: item.fileUrl,
            orderNumber: item.orderNumber,
            status: 1,
            updatedBy: userId,
          };

          if (item.id && Number(item.id) > 0) {

            const [updatedCount] = await conn.PageTeams.update(
                itemData,
                {
                  where: {
                    id: item.id,
                    pageId,
                  },
                  transaction,
                }
              );

            if (updatedCount === 0) {
              throw new Error( `Team item ${item.id} not found.`);
            }

            savedItems.push({id: item.id,...itemData,});

          } else {

            const created = await conn.PageTeams.create(
                {...itemData, createdBy: userId, }, {transaction,}
              );

            savedItems.push(created);
          }
        }

        // --------------------------------------
        // Commit
        // --------------------------------------

        await transaction.commit();

        return { items: savedItems,};

      } catch (error) {

        await transaction.rollback();

        console.error("saveTeam service error:",error);

        throw error;
      }
  },
  ///////End Page Team //////////////



  getList: async (type, all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0, type: type };
      let columns = ["id", "type", "title", "fileUrl", "remark1", "remark2", "orderNumber", "status", "createdAt"];
      if(!all){
        columns = ["id", "type", "title", "fileUrl", "remark1" ];
        filter = {...filter, status:1}
      }
      await conn.LearningPages.findAndCountAll({
        attributes:columns,
        where: filter,
        order: [['orderNumber', 'ASC'], ['id', 'ASC']],
        // raw: true,
        logging:console.log
      })
        .then(async data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  create: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExist: async (type, title, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.findOne({
        where: { 
          type : type.trim(),  
          title: title.trim(),          
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
  getById: async (mentorId) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.findOne({
        attributes: [ "*",['fileUrl', 'filePath']],
        where: { id: mentorId },
        raw:true
      })
        .then(data => {
          if (data !== null) {
            resolve(data);
          } else {
            reject(false);
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changeStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.update({
        status: body.status
      }, {
        where: { id: body.mentorId },
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
