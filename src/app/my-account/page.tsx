import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Home, User } from "lucide-react";

const orders = [
    { id: "ORD001", date: "2023-10-26", total: 4540, status: "Delivered" },
    { id: "ORD002", date: "2023-11-15", total: 1240, status: "Shipped" },
    { id: "ORD003", date: "2023-11-20", total: 850, status: "Processing" },
];

function OrdersTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Orders</CardTitle>
                <CardDescription>View your past and current orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell className="text-right">₹{order.total.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function ProfileTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Profile Details</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Aarav Sharma" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="aarav.sharma@example.com" />
                </div>
                <Separator />
                <h3 className="text-lg font-headline">Change Password</h3>
                 <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                <Button>Update Profile</Button>
            </CardContent>
        </Card>
    );
}

function AddressesTab() {
     return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Addresses</CardTitle>
                <CardDescription>Manage your saved shipping addresses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="p-4 bg-muted/50">
                    <p className="font-semibold">Aarav Sharma</p>
                    <p>123 Art Lane, Creativity Nagar,</p>
                    <p>Mumbai, Maharashtra, 400001</p>
                    <p>India</p>
                    <p>Phone: 9876543210</p>
                    <div className="mt-4 space-x-4">
                        <Button variant="outline">Edit</Button>
                        <Button variant="destructive">Delete</Button>
                    </div>
                </Card>
                <Button>Add New Address</Button>
            </CardContent>
        </Card>
    );
}

export default function MyAccountPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-headline text-center mb-12">My Account</h1>
            <Tabs defaultValue="orders" className="flex flex-col md:flex-row gap-8">
                <TabsList className="flex md:flex-col h-auto bg-transparent p-0 gap-2 items-start">
                    <TabsTrigger value="orders" className="w-full justify-start gap-2">
                        <Box className="h-5 w-5" /> Orders
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="w-full justify-start gap-2">
                        <User className="h-5 w-5" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="w-full justify-start gap-2">
                        <Home className="h-5 w-5" /> Addresses
                    </TabsTrigger>
                </TabsList>
                <div className="flex-grow">
                    <TabsContent value="orders"><OrdersTab /></TabsContent>
                    <TabsContent value="profile"><ProfileTab /></TabsContent>
                    <TabsContent value="addresses"><AddressesTab /></TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
