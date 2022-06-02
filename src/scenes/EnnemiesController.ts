const createKey = (name: string, id: number) => {
    return `${name}-${id}`
}

export default class ObstaclesController
{
    private ennemies = new Map<string, MatterJS.BodyType>()

    add(name: string, body: MatterJS.BodyType)
    {
        const key = createKey(name, body.id)
        if(this.ennemies.has(key))
        {
            throw new Error('obstacle already exists as this key')
        }
        this.ennemies.set(key, body)
    }

    is(name: string, body:MatterJS.BodyType)
    {
        const key = createKey(name, body.id)
        if(!this.ennemies.has(key))
        {
            return false
        }
        return true
    }

    delete(name: string, body:MatterJS.BodyType)
    {
        const key = createKey(name, body.id)
        if(this.ennemies.has(key))
        {
            this.ennemies.delete(key)
        }
    }
}