import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const saltRounds = 10; 

class UserController {
    constructor() {}

    async listUser(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            res.json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const userdata = req.body;

            if (!userdata.email) {
                return res.status(400).json({
                    status: 400,
                    message: "Você precisa passar o email no corpo da requisição",
                });
            }

            
            if (!userdata.password) {
                return res.status(400).json({
                    status: 400,
                    message: "Você precisa passar a senha no corpo da requisição",
                });
            }

            
            const hashedPassword = await bcrypt.hash(userdata.password, saltRounds);

            
            const newuser = await prisma.user.create({
                data: {
                    ...userdata,
                    password: hashedPassword, 
                },
            });

            console.log(newuser);

            res.status(201).json({
                status: 201,
                newuser: newuser,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: "Erro ao criar usuário",
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const body = req.body;

            const updatedUser = await prisma.user.update({
                where: {
                    id: parseInt(id),
                },
                data: body,
            });

            if (updatedUser) {
                return res.json({
                    status: 200,
                    updatedUser: updatedUser,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: error,
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id;

            await prisma.user.delete({
                where: {
                    id: parseInt(id),
                },
            });

            res.status(200).json({
                status: 200,
                message: "Usuário deletado com sucesso",
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: "Falha ao deletar o registro",
            });
        }
    }
}

export default new UserController();