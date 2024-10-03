import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CommentController {
    constructor() {}

    async listComment(req: Request, res: Response) {
        try {
            const comments = await prisma.comment.findMany();
            res.json(comments);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createComment(req: Request, res: Response) {
        try {
            const commentData = req.body;

            if (!commentData.title) {
                return res.status(400).json({
                    status: 400,
                    message: "Você precisa passar o título no corpo da requisição",
                });
            }

            if (!commentData.authorId) {
                return res.status(400).json({
                    status: 400,
                    message: "Você precisa passar o ID do usuário que comentou no corpo da requisição",
                });
            }

            const newComment = await prisma.comment.create({
                data: {
                    title: commentData.title,
                    authorId: commentData.authorId,
                },
            });

            res.status(201).json({
                status: 201,
                newComment: newComment,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Failed to create comment" });
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const body = req.body;

            const updatedComment = await prisma.comment.update({
                where: {
                    id: parseInt(id),
                },
                data: body,
            });

            res.json({
                status: 200,
                updatedComment: updatedComment,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Failed to update comment" });
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const id = req.params.id;

            await prisma.comment.delete({
                where: {
                    id: parseInt(id),
                },
            });

            res.status(200).json({
                status: 200,
                message: "Comentário deletado com sucesso",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Falha ao deletar o registro" });
        }
    }
}

export default new CommentController();