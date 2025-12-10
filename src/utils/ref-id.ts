export const generateRefId = (agentCode:string) => {
    return `ref-${agentCode}-${Date.now()}`;
}