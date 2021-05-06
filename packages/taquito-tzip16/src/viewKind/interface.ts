export interface View {
    executeView(...args: any[]): Promise<any>;
}