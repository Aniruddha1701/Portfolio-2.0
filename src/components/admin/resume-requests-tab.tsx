"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, FileText, Clock, Mail } from "lucide-react";

interface ResumeRequest {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export function ResumeRequestsTab() {
  const [requests, setRequests] = useState<ResumeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/admin/resume-requests?t=${new Date().getTime()}`);
      if (res.ok) {
        const response = await res.json();
        if (response.success && Array.isArray(response.data)) {
          setRequests(response.data);
        } else if (Array.isArray(response)) {
          // Fallback for old format if any endpoints still use it
          setRequests(response);
        }
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    setProcessingId(id);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch("/api/admin/resume-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action, origin }),
      });
      if (res.ok) {
        setRequests(requests.map(req => 
          req._id === id ? { ...req, status: action } : req
        ));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gray-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-purple-400" />
            Resume Access Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No resume requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div 
                  key={req._id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="space-y-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{req.name}</span>
                      {req.status === "pending" && (
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-none">Pending</Badge>
                      )}
                      {req.status === "approved" && (
                        <Badge className="bg-emerald-500/20 text-emerald-500 border-none">Approved</Badge>
                      )}
                      {req.status === "rejected" && (
                        <Badge className="bg-red-500/20 text-red-500 border-none">Rejected</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-4">
                      <span>{req.email}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Button
                        size="sm"
                        disabled={processingId === req._id}
                        onClick={() => handleAction(req._id, "approved")}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 md:flex-none"
                      >
                        {processingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={processingId === req._id}
                        onClick={() => handleAction(req._id, "rejected")}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 flex-1 md:flex-none"
                      >
                        {processingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
