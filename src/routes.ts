// import { createUserValidation, validateParameters, createPostValidation } from "./validation/validation";
// import { UserController } from "./controller/UserController";
// import { BlogController } from "./controller/PostController";
// import { isAuthorized } from "./middleware/userAuth";

// export const Routes = [{
//     method: "get",
//     route: "/users",
//     controller: UserController,
//     action: "findAllUsers",
//     validation: []
// },
// {
//     method: "get",
//     route: "/users/:id",
//     controller: UserController,
//     action: "getOneUser",
//     validation: validateParameters
// },
// {
//     method: "post",
//     route: "/users",
//     controller: UserController,
//     action: "createUser",
//     validation: createUserValidation

// },
// {
//     method: "post",
//     route: "/user/login",
//     controller: UserController,
//     action: "createUser",
//     validation: createUserValidation,


// },
// {
//     method: "delete",
//     route: "/users/:id",
//     controller: UserController,
//     action: "deleteUser",
//     validation: createUserValidation,

// },
// {
//     method: "patch",
//     route: "/users/:id",
//     controller: UserController,
//     action: "updateUser",
//     validation: validateParameters,

// },
// {
//     method: "get",
//     route: "/users/:token/verify",
//     controller: UserController,
//     action: "verifyUser",
//     validation: []
// },
// {
//     method: "get",
//     route: "/api/post",
//     controller: BlogController,
//     action: "findAllPosts",
//     validation: [],
//     middleware: [isAuthorized]
// },
// {
//     method: "get",
//     route: "/api/post/:id",
//     controller: BlogController,
//     action: "getOnePost",
//     validation: validateParameters,
//     middleware: [isAuthorized]
// },
// {
//     method: "post",
//     route: "/api/post",
//     controller: BlogController,
//     action: "createPost",
//     validation: createPostValidation,
// },
// {
//     method: "delete",
//     route: "/api/post/:id",
//     controller: BlogController,
//     action: "deletePost",
//     validation: validateParameters
// },
// {
//     method: "patch",
//     route: "/api/post/:id",
//     controller: BlogController,
//     action: "updatePost",
//     validation: createUserValidation
// }
// ]


