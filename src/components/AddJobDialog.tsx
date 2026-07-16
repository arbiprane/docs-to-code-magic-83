import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddJob, type NewJobInput } from "@/lib/use-jobs";

const emptyForm: NewJobInput = {
  jobTitle: "",
  jobCategory: "",
  collarType: "White Collar",
  mainTasks: "",
  aiExposureLevel: "Medium",
  replacementRiskLevel: "Medium",
};

export function AddJobDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NewJobInput>(emptyForm);
  const addJob = useAddJob();

  const isValid = form.jobTitle.trim() !== "" && form.jobCategory.trim() !== "";

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      await addJob.mutateAsync(form);
      toast.success("Job added");
      setForm(emptyForm);
      setOpen(false);
    } catch {
      toast.error("Couldn't add job. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add job
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a job</DialogTitle>
          <DialogDescription>
            Add a new occupation to the tracked dataset.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="jobTitle">Job title</Label>
            <Input
              id="jobTitle"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              placeholder="e.g. Logistics Coordinator"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="jobCategory">Category</Label>
              <Input
                id="jobCategory"
                value={form.jobCategory}
                onChange={(e) => setForm({ ...form, jobCategory: e.target.value })}
                placeholder="e.g. Logistics"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Collar type</Label>
              <Select
                value={form.collarType}
                onValueChange={(v) =>
                  setForm({ ...form, collarType: v as NewJobInput["collarType"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="White Collar">White Collar</SelectItem>
                  <SelectItem value="Blue Collar">Blue Collar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mainTasks">Main tasks</Label>
            <Textarea
              id="mainTasks"
              value={form.mainTasks}
              onChange={(e) => setForm({ ...form, mainTasks: e.target.value })}
              placeholder="What does this role actually do day to day?"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>AI exposure</Label>
              <Select
                value={form.aiExposureLevel}
                onValueChange={(v) =>
                  setForm({ ...form, aiExposureLevel: v as NewJobInput["aiExposureLevel"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Replacement risk</Label>
              <Select
                value={form.replacementRiskLevel}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    replacementRiskLevel: v as NewJobInput["replacementRiskLevel"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || addJob.isPending}>
            {addJob.isPending ? "Adding…" : "Add job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
