import logger from './util/logger.js';

export default function () {

    (async () => {

        logger.info('Loading mock data...');
        logger.debug("Deleting old data...");
        // make sure to delete in the right order to prevent invalid foreign keys

        // await prismaClient.communityMember.deleteMany();
        // await prismaClient.post.deleteMany();
        // await prismaClient.community.deleteMany();
        // await prismaClient.loginInfo.deleteMany();
        // await prismaClient.user.deleteMany();

        // logger.debug("Deleted old data!");
        // logger.debug("Generating new mock data...");

        // const UnknownUser = (await prismaClient.user.create({
        //     data: {
        //         UserID: 'Anonymous User',
        //         Bio: '',
        //         IsAdmin: false
        //     }
        // })).UserID;
        // const admin = (await prismaClient.user.create({
        //     data: {
        //         UserID: 'Admin',
        //         Bio: '',
        //         IsAdmin: true
        //     }
        // })).UserID;

        // await prismaClient.loginInfo.create({
        //     data: {
        //         GoogleID: '103765847665923698238',
        //         FirstName: 'admin',
        //         Email:'admin@admin.admin',
        //         IsAdmin:true,
        //         UserID: "Admin"
        //     }
        // });

        // await prismaClient.community.create({
        //     data: {
        //         Name: "SCP foundation",
        //         Description: "Secure. Contain. Protect.",
        //         CreatedBy: (await prismaClient.user.findFirst({skip:1}))!.UserID
        //     }
        // });

        // await prismaClient.communityMember.create({
        //     data: {
        //         CommunityID: (await prismaClient.community.findFirst())!.CommunityID,
        //         UserID: (await prismaClient.user.findFirst({skip:1}))!.UserID
        //     }
        // });

        // for (const post of postData) {
        //     await prismaClient.post.create({
        //         data: {
        //             Title: post.title,
        //             Description: post.description,
        //             Class: post.class,
        //             Body: post.body,
        //             CommunityID: (await prismaClient.community.findFirst())!.CommunityID,
        //             AuthorID: 'Anonymous User',
        //             Url: post.image,
        //             Type: post.image ? PostType.IMAGE : PostType.TEXT
        //         }
        //     });
        // }
    
        logger.debug("Generated mock data!");
        
        logger.info('Loaded mock data!');
    })();
}