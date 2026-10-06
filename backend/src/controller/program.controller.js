var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const programTypeService = require('../services/programType.service');
const contactService = require('../services/contactus.service');
const slideContextService = require('../services/slideContext.service');
const programService = require('../services/program.service');
const moment = require('moment');

const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

let ProgramController = {
    generateSignedUrl: async (fileUrl) => {
        if (!fileUrl) {
            return null;
        }

        try {

            let key = "";

            const filePath = fileUrl.trim();

            // If complete S3 URL is stored
            if (filePath.includes(".amazonaws.com/")) {

                const url = new URL(filePath);

                key = decodeURIComponent(
                    url.pathname.replace(/^\/+/, "")
                );

            } else {

                // If only S3 key/path is stored
                key = filePath.replace(/^\/+/, "");
            }

            if (!key) {
                return null;
            }

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key,
            });

            return await getSignedUrl(
                s3,
                command,
                {
                    expiresIn: 900
                }
            );

        } catch (error) {

            console.error(
                "Generate S3 signed URL error:",
                error
            );

            return null;
        }
    },
    //use this for frontend list
    getList: async (request, response, next) => {
        try {
            let programData = await programService.getHomePageProgramList(false);
            const programDataWithSignedUrls = await Promise.all(
                (programData || []).map(async (program) => {
                    // Convert Sequelize instance to plain object
                    const programObj = program.get ? program.get({ plain: true }) : program;

                    // console.log("program row >>>", programObj);
                    const fileViewUrl = programObj.fileUrl ? await ProgramController.generateSignedUrl(programObj.fileUrl) : null;
                    return {...programObj, fileViewUrl, };
                })
            );              
            // console.log('lit >>>>>>>:::', mentors);
            return responder.sendResponse(response, 200, "success", programDataWithSignedUrls, "Programs retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    getMenuAndContactList: async (request, response, next) => {
        try {
            let categoryList = await programTypeService.getTypeList();
            let data = await contactService.getContactWithAddress();

            let slide = await slideContextService.getSlideContextBySlide('Footer-Context');
            
            // console.log('contact log >>>', data);
            const result = {
                menu: categoryList,
                contact: data,
                footerContext: slide
            }
            // console.log('menu log >>>', result);

            return responder.sendResponse(response, 200, "success", result, "Menu List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },

    getTypeList: async (request, response, next) => {
        try {
            let categoryList = await programTypeService.getTypeList();
            return responder.sendResponse(response, 200, "success", categoryList, "Type List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },

    getProgramDetailsById: async (request, response, next) => {
        try {
            const programId = parseInt(request.params.programId);

            if (!programId || programId <= 0) {
                return response.status(400).json({status: "error",message: "Invalid Program ID."});
            }

            const data = await programService.getProgramDetailsById(programId);
            if (!data) {
                return response.status(404).json({status: "error",message: "Program not found."});
            }

            data.fileViewUrl = data.fileUrl ? await ProgramController.generateSignedUrl(data.fileUrl) : "";
            data.impactFileViewUrl = data.impactFileUrl ? await ProgramController.generateSignedUrl(data.impactFileUrl) : "";
            data.joinFileViewUrl = data.joinFileUrl ? await ProgramController.generateSignedUrl(data.joinFileUrl) : "";
            data.ProgramNeeds =
                await Promise.all(
                    data.ProgramNeeds.map(
                        async (need) => ({
                            ...need,
                            fileViewUrl: need.fileUrl ? await ProgramController.generateSignedUrl( need.fileUrl) : ""
                        })
                    )
                );
            if(data.Mentors && data.Mentors?.length){
                data.Mentors = await Promise.all(
                    data.Mentors.map(
                        async (item) => ({
                            ...item,
                            fileViewUrl: item.fileUrl ? await ProgramController.generateSignedUrl( item.fileUrl) : ""
                        })
                    )
                );    
            }    

                console.log('res >>>', data);

            // return response.status(200).json({status: "success",data});
            return responder.sendResponse(response, 200, "success", data, "Program retrieved successfully.");

        } catch (error) {
            console.error("getProgramById Error:",error);

            return next(error);
        }
    },

    //use this for backend list
    
    getProgramddList: async (request, response, next) => {
        try {
            let data = await programService.getProgramddList();
            const rows = data.rows.map((r) => r.get({ plain: true }));
                           
            console.log('lit >>>>>>>:::', rows);
            let dataList =  { 'totalRecord': data.count, 'list': rows };
            return responder.sendFilterResponse(response, 200, "success", dataList, "Programs DDList retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    getProgramList: async (request, response, next) => {
        try {
            let data = await programService.getProgramList(true);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const programs = await Promise.all(
                rows.map(async (row) => {

                    const [
                        fileUrl,
                        // impactFileUrl,
                        // joinFileUrl,
                    ] = await Promise.all([

                        row?.fileUrl ? ProgramController.generateSignedUrl(row.fileUrl): null,
                        // row?.impactFileUrl ? ProgramController.generateSignedUrl(row.impactFileUrl): null,
                        // row?.joinFileUrl ? ProgramController.generateSignedUrl(row.joinFileUrl): null,
                    ]);

                    row.fileViewUrl = fileUrl;
                    // row.impactFileViewUrl = impactFileUrl;
                    // row.joinFileViewUrl = joinFileUrl;

                    return row;
                })
            );                
            console.log('lit >>>>>>>:::', programs);
            let dataList =  { 'totalRecord': data.count, 'list': programs };
            return responder.sendFilterResponse(response, 200, "success", dataList, "Programs retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    checkValidProgram: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            let programId = request.body.programId ? request.body.programId : 0;
            checkIfExist = await programService.checkExistProgram(request.body.name, request.body.title, programId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Program Already Exist for this name");
            } else {
                return responder.sendResponse(response, 200, "success", '', "No match found");
            }
        } catch (error) {
            return next(error);
        }
    }, 
    createProgram: async (request, response, next) => {
        try {
            const body = request.body;
            const userId = request.user.userId;

            // -----------------------------------------
            // validation
            // -----------------------------------------

            if (!body.programTypeId || body.programTypeId == null) {
                return responder.sendResponse( response, 200, "error", '', "Program type is required." );
            }
            if (!body.name || !body.name.trim()) {
                return responder.sendResponse( response, 200, "error", '', "Program name is required." );
            }
            if (!body.title || !body.title.trim()) {
                return responder.sendResponse(response,200,"error",'',"Program title is required.");
            }
            if (!body.shortDesc || !body.shortDesc.trim()) {
                return responder.sendResponse(response,200,"error",'',"Program title is required.");
            }

            const programNeeds = Array.isArray(body.programNeeds)
                ? body.programNeeds
                : [];

            if (programNeeds.length > 5) {
                return responder.sendResponse(response,200,"error",'',"Maximum 3 Program Needs are allowed.");
            }

            for (let i = 0; i < programNeeds.length; i++) {
                const need = programNeeds[i];

                if (!need.remarks || !need.remarks.trim()) {
                    return responder.sendResponse(response,200,"error",'',`Program Need ${i + 1} remarks is required.`);
                }
            }
            const checkIfExist = await programService.checkExistProgram( body.name.trim(),body.title ? body.title.trim() : '');

            if (checkIfExist === true) {
                return responder.sendResponse(response,200,"error",'',"Program Already Exist");
            }

            // -----------------------------------------
            // Prepare Program data
            // -----------------------------------------

            const programData = {
                programTypeId: body.programTypeId,
                name: body.name.trim(),
                shortDesc: body.shortDesc
                    ? body.shortDesc.trim()
                    : '',
                title: body.title
                    ? body.title.trim()
                    : '',
                remarks: body.remarks || '',
                fileUrl: body.fileUrl || '',

                impactHeading: body.impactHeading
                    ? body.impactHeading.trim()
                    : '',

                impactTitle: body.impactTitle
                    ? body.impactTitle.trim()
                    : '',

                impactFileUrl: body.impactFileUrl || '',

                impactDescription:
                    body.impactDescription || '',

                joinTitle: body.joinTitle
                    ? body.joinTitle.trim()
                    : '',

                joinFileUrl: body.joinFileUrl || '',

                joinDescription:
                    body.joinDescription || '',

                createdBy: userId
            };

            // -----------------------------------------
            // Prepare Program Needs
            // -----------------------------------------

            const now = new Date();
            const needsData = programNeeds.map((need) => ({
                title: need.title.trim() || '',
                fileUrl: need.fileUrl || '',
                remarks: need.remarks || '',
                createdBy: userId,
                createdAt: now,
            }));

            // -----------------------------------------
            // Create Program + Needs
            // -----------------------------------------

            const created = await programService.createProgramWithNeeds( programData, needsData);

            return responder.sendResponse(response,200,"success",created,"Program created successfully.");

        } catch (error) {
            console.error("createProgram controller error:",error);
            return next(error);
        }
    },
    getProgramById: async (request, response, next) => {
        try {
            const programId = parseInt(request.params.programId);

            if (!programId || programId <= 0) {
                return response.status(400).json({status: "error",message: "Invalid Program ID."});
            }

            const data = await programService.getProgramById(programId);
            if (!data) {
                return response.status(404).json({status: "error",message: "Program not found."});
            }

            data.fileViewUrl = data.fileUrl ? await ProgramController.generateSignedUrl(data.fileUrl) : "";
            data.impactFileViewUrl = data.impactFileUrl ? await ProgramController.generateSignedUrl(data.impactFileUrl) : "";
            data.joinFileViewUrl = data.joinFileUrl ? await ProgramController.generateSignedUrl(data.joinFileUrl) : "";
            data.ProgramNeeds =
                await Promise.all(
                    data.ProgramNeeds.map(
                        async (need) => ({
                            ...need,
                            fileViewUrl: need.fileUrl ? await ProgramController.generateSignedUrl( need.fileUrl) : ""
                        })
                    )
                );

                console.log('res >>>', data);

            // return response.status(200).json({status: "success",data});
            return responder.sendResponse(response, 200, "success", data, "Program retrieved successfully.");

        } catch (error) {
            console.error("getProgramById Error:",error);

            return next(error);
        }
    },
    updateProgram: async (request,response,next) => {
        try {
            const body = request.body;
            const programId = parseInt(body.id);

            if (!programId || programId <= 0) {
                //  return responder.sendResponse( response, 200, "error", '', "Program name is required." );
                return response.status(400).json({status: "error",message:"Invalid Program ID."});
            }

            if (!body.programTypeId || body.programTypeId == null) {
                return response.status(400).json({ status: "error",message:"Program Type is required."});
            }

            if (!body.name || !body.name.trim()) {
                return response.status(400).json({ status: "error",message:"Program name is required."});
            }

            if (!body.title || !body.title.trim()) {
                return response.status(400).json({ status: "error",message:"Program title is required."});
            }

            if (!body.shortDesc ||!body.shortDesc.trim()) {
                return response.status(400).json({ status: "error",message:"Short Description is required."});
            }

            if (!Array.isArray(body.programNeeds)) {
                body.programNeeds = [];
            }

            if (body.programNeeds.length >3) {
                return response.status(400).json({status: "error",message:"Maximum 3 Program Needs are allowed."});
            }

            let checkIfExist = false;
            checkIfExist = await programService.checkExistProgram(request.body.name, request.body.title, programId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Program Already Exist");
            }

            const result = await programService.updateProgram(body);

            return response.status(200).json({ status: "success",message:"Program updated successfully.",data: result});

        } catch (error) {
            console.error("updateProgram Error:",error);

            return next(error);
        }
    },
    changeProgramStatus: async (request, response, next) => {
        try {
            // console.log('changeStatus reached', request.body, request.user);  
            const body = request.body;
            const programId = parseInt(body.programId);

            if (!programId || programId <= 0) {
                return response.status(400).json({status: "error",message:"Invalid Program ID."});
            }

            const data = { status: body.status };
            let updated = await programService.changeProgramStatus(data, programId);
            return responder.sendResponse(response, 200, "success", updated, "Program updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },
    changeShowRecordStatus: async (request, response, next) => {
        try {
            // console.log('changeStatus reached', request.body, request.user);  
            const body = request.body;
            const programId = parseInt(body.programId);

            if (!programId || programId <= 0) {
                return response.status(400).json({status: "error",message:"Invalid Program ID."});
            }

            const data = { showRecord: body.showRecord };
            let updated = await programService.changeProgramStatus(data, programId);
            return responder.sendResponse(response, 200, "success", updated, "Program updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = ProgramController;
