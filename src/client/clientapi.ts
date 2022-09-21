// @ts-expect-error TS(2304) FIXME: Cannot find name 'findUnqiue'.
findUnqiue("user", {
    where: {
        id: 1
    },
    include: {
        table: {
            name: 'posts',
            on: ['id', 'id'],
            select: {

            },
            include: {}
        }
    }
})
