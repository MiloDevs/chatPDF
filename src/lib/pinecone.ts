import {Pinecone} from '@pinecone-database/pinecone'
import { downloadFroms3 } from './s3-server';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'

let pinecone: Pinecone | null = null;


export const getPineConeClient = async () => {
    if(!pinecone){
        pinecone = await new Pinecone(
            { 
                apiKey: process.env.PINECONE_API_KEY!, 
                environment: process.env.PINECONE_ENVIRONMENT!, 
                projectId: process.env.PINECONE_PROJECT_ID!, 
            }
        );
 
        return pinecone;
    }
}

export async function loads3IntoPinecone(fileKey: string) {
    //1. obtain PDF
    console.log('downloading s3 into file system');
    const file_name = await downloadFroms3(fileKey)
    if(!file_name){
        throw new Error('could not download from s3');
    }
    const loader = new PDFLoader(file_name)
    const pages = await loader.load()
    console.log(pages);
    return pages;
}