export interface Computer {
    ID: number;
    Name: string;
    CPU: string;
    GPU: string;
    RAM: string;
    HDD: string;
    SSD: string;
    Image: string;
    Price: number;
}

export interface GPU {
    ID: number;
    Name: string;
    Frequency: number;
    Memory: number;
    Image: string;
    Price: number;
}

export interface CPU {
    ID: number;
    Name: string;
    Frequency: number;
    Cores: number;
    Cache: number;
    Image: string;
    Price: number;
}

export interface RAM {
    ID: number;
    Name: string;
    Type: string;
    Frequency: number;
    Memory: number;
    TypePort: string;
    Image: string;
    Price: number;
}

export interface Laptop {
    ID: number;
    Name: string;
    Model: string;
    CPU: string;
    GPU: string;
    RAM: string;
    HDD: string;
    SSD: string;
    Image: string;
    Price: number;
}

export interface StorageDevice {
    ID: number;
    Name: string;
    Type: string;
    Frequency: number;
    Memory: number;
    Image: string;
    Price: number;
}