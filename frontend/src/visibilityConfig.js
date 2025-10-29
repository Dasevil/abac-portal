export const columnVisibility = {
  users: {
    admin: ['id', 'username', 'role', 'department', 'actions'],
    accountant: ['id', 'username', 'department'],
    analyst: ['id', 'username', 'department'],
    manager: ['id', 'username', 'role', 'department'],
    employee: ['id', 'username', 'department'],
    viewer: ['username', 'department']
  },
  documents: {
    admin: ['id', 'title', 'department', 'status', 'sensitivity'],
    accountant: ['id', 'title', 'sensitivity'],
    analyst: ['id', 'title', 'status'],
    manager: ['id', 'title', 'department', 'status'],
    employee: ['id', 'title', 'department'],
    viewer: ['title']
  }
};


