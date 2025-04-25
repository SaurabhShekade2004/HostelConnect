import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AllotmentDetails({ allotment }) {
  if (!allotment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Hostel Allotment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Not allotted yet</p>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              Pending
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Hostel Allotment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Hostel Building</p>
              <p className="font-medium">{allotment.hostelBuilding}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="font-medium">{allotment.roomNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Floor</p>
              <p className="font-medium">{allotment.floor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bed Number</p>
              <p className="font-medium">{allotment.bedNumber}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Roommates</p>
            {allotment.roommates && allotment.roommates.length > 0 ? (
              <ul className="space-y-2">
                {allotment.roommates.map(roommate => (
                  <li key={roommate.id} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary flex items-center justify-center mr-2">
                      {roommate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{roommate.name}</p>
                      <p className="text-sm text-muted-foreground">{roommate.department}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No roommates assigned yet</p>
            )}
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Warden Contact</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary flex items-center justify-center mr-3">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <p className="font-medium">{allotment.warden?.name || 'Not assigned'}</p>
                <p className="text-sm text-muted-foreground">{allotment.warden?.phoneNumber || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Allotment Date</p>
            <p className="font-medium">{allotment.allotmentDate ? new Date(allotment.allotmentDate).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
