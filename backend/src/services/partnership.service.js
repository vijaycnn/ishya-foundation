const { QueryTypes } = require('sequelize');
let DataProvider = {

  getPageData: async () => {
    return new Promise(async function (resolve, reject) {
      let filter = { status: 1 };
      
      await conn.Partnerships.findAndCountAll({
        where: filter,
        include: [
          {
            model: conn.PartnershipBlogs,
            attributes: ['id', 'partnershipId', 'title', 'subTitle', 'fileUrl', 'remarks' ],
            where: { status: 1},
            required: false
          },
          {
            model: conn.PartnershipContacts,
            attributes: ['id', 'partnershipId', 'title', 'link', 'fileUrl', 'remarks' ],
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

  ///////Page PartnershipBlog service //////////////
  savePartnershipBlog: async (body, request) => {
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

        const page = await conn.Partnerships.findOne({
          where: {
            id: pageId,
            status: 1,
          },
          transaction,
        });

        if (!page) {
          throw new Error("Partnership page record not found.");
        }

        // --------------------------------------
        // Delete removed rows
        // --------------------------------------

        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          await conn.PartnershipBlogs.update(
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
                partnershipId: pageId,
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
            partnershipId: pageId,
            title: item.title || "",
            fileUrl: item.fileUrl,
            remarks: item.remarks || "",
            orderNumber: item.orderNumber,
            status: 1,
            updatedBy: userId,
          };

          if (item.id && Number(item.id) > 0) {

            const [updatedCount] = await conn.PartnershipBlogs.update(
                itemData,
                {
                  where: {
                    id: item.id,
                    partnershipId: pageId,
                  },
                  transaction,
                }
              );

            if (updatedCount === 0) {
              throw new Error( `Blog item ${item.id} not found.`);
            }

            savedItems.push({id: item.id,...itemData,});

          } else {

            const created = await conn.PartnershipBlogs.create(
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

        console.error("savePartnershipBlog service error:",error);

        throw error;
      }
  },
  ///////Page PartnershipContact service //////////////
  savePartnershipContact: async (body, request) => {
      const transaction = await conn.sequelize.transaction();

      try {
        const {
          pageId,
          impactHeading,
          contactRemarks,
          items = [],
          deletedIds = [],
        } = body;

        const userId = request.user?.userId || null;

        // --------------------------------------
        // Validate page
        // --------------------------------------

        const page = await conn.Partnerships.findOne({
          where: {
            id: pageId,
            status: 1,
          },
          transaction,
        });

        if (!page) {
          throw new Error("Partnership page record not found.");
        }

        // --------------------------------------
        // Update PageMasters
        // --------------------------------------

        await conn.Partnerships.update(
          {
            impactHeading: impactHeading?.trim() || null,
            remarks: contactRemarks?.trim() || null,
            updatedBy: userId,
          },
          { where: { id: pageId }, transaction, }
        );

        // --------------------------------------
        // Delete removed rows
        // --------------------------------------

        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          await conn.PartnershipContacts.update(
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
                partnershipId: pageId,
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
            partnershipId: pageId,
            title: item.title,
            link: item.link,
            fileUrl: item.fileUrl,
            remarks: item.remarks || "",
            // orderNumber: item.orderNumber,
            status: 1,
            updatedBy: userId,
          };

          if (item.id && Number(item.id) > 0) {

            const [updatedCount] = await conn.PartnershipContacts.update(
                itemData,
                {
                  where: {
                    id: item.id,
                    partnershipId: pageId,
                  },
                  transaction,
                }
              );

            if (updatedCount === 0) {
              throw new Error( `Zig-Zag item ${item.id} not found.`);
            }

            savedItems.push({id: item.id,...itemData,});

          } else {

            const created = await conn.PartnershipContacts.create(
                {...itemData, createdBy: userId, }, {transaction,}
              );

            savedItems.push(created);
          }
        }

        // --------------------------------------
        // Commit
        // --------------------------------------

        await transaction.commit();

        return { impactHeading: impactHeading?.trim() || "", contactRemarks: contactRemarks || "", items: savedItems,};

      } catch (error) {

        await transaction.rollback();

        console.error("savePartnershipContact service error:",error);

        throw error;
      }
  },
  
  
  
};
module.exports = DataProvider;
