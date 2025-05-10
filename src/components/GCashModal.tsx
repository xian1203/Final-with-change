import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface GCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

const GCashModal = ({ isOpen, onClose, onSuccess, amount }: GCashModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      console.log("Payment proof submitted:", file);
      toast.success("Payment submitted successfully!");
      onSuccess();
    } else {
      toast.error("Please upload proof of payment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[100] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
            GCash Payment
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Amount to Pay:</p>
            <p className="text-2xl font-bold text-blue-600">₱{amount}</p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-sm w-[300px] h-[300px] flex items-center justify-center">
              <img 
              src="/assets/gcash.png" 
              alt="GCash QR Code" 
              className="w-full h-auto object-contain bg-white p-4 rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/300?text=QR+Code+Not+Found";
              }}
            />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Transfer fees may apply.</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">M: 099•••••321</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">User ID: ••••••••••18RM3U</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Please upload a screenshot of your payment confirmation
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
          >
            Submit Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GCashModal;
