"use client";

import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { Trash2, Clock, User } from "lucide-react";
import { Message } from "@/model/User";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { useState } from "react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message || "Message deleted successfully");
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to delete message", {
        description:
          axiosError.response?.data.message ?? "An unexpected error occurred",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    const messageDate = dayjs(date);
    const now = dayjs();
    const diffInHours = now.diff(messageDate, "hour");

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return messageDate.format("MMM D, YYYY");
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  Message
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(message.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                aria-label="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  Delete Message
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  Are you sure you want to delete this message? This action
                  cannot be undone and the message will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="relative">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
            {message.content}
          </p>
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full opacity-20"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full translate-y-10 -translate-x-10 pointer-events-none"></div>
      </CardContent>
    </Card>
  );
}
