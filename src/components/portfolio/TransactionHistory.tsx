
import { PortfolioTransaction } from "@/types/property";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface TransactionHistoryProps {
  transactions: PortfolioTransaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Transaction History</h4>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableCaption>A history of your transactions for this property</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={transaction.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {transaction.type === "Buy" ? (
                      <ArrowDownRight className="h-4 w-4 mr-1 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 mr-1 text-red-500" />
                    )}
                    <span>{transaction.type}</span>
                  </div>
                </TableCell>
                <TableCell>{transaction.tokens}</TableCell>
                <TableCell>{formatCurrency(transaction.price)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(transaction.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;
