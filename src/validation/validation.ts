import { param, ValidationChain, body, check } from "express-validator";

export const createUserValidation: ValidationChain[] = [
    body('firstName').isString().withMessage('First Name must be a string'),
    body('lastName').isString().withMessage('Last name must be a string'),
    body('age').isInt().withMessage('Age must be a number'),
];

export const loginUserValidation: ValidationChain[] = [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({ min: 6 }),
];

export const validateParameters: ValidationChain[] = [
    param('id').isInt().withMessage('Id must be a number'),
];

export const createPostValidation: ValidationChain[] = [
    body('title').isString().withMessage('Title must be a string'),
    body('content').isString().withMessage('Content must be a string'),
]

export const updatePostValidation: ValidationChain[] = [
    body('title').isString().withMessage('Title must be a string'),
    body('content').isString().withMessage('Content must be a string'),
    param('id').isInt().withMessage('Id must be a number'),
]


