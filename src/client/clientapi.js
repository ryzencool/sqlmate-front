findUnqiue("user", {
    where: {
        id: 1
    },
    include: {
        table: {
            name: 'posts',
            on: ['id', 'id'],
            select: {},
            include: {}
        }
    }
})
