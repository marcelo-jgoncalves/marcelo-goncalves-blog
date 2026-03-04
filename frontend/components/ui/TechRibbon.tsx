import Image from 'next/image';
import './TechRibbon.css';

export default function TechRibbon() {
  return (
    // 🚀 Pilar 4: Trocamos <div> por <section> para validar o aria-label
    <section className="op-tech-ribbon" aria-label="Tecnologias Core da Arquitetura">
      <div className="container op-tech-container">
        <span className="op-tech-label">Core Stack</span>
        <div className="op-tech-list">
          {/* ⚠️ ALERTA ARQUITETURAL: 
            Certifique-se de que wikimedia.org, jsdelivr.net e icepanel.io 
            estão autorizados no seu next.config.js!
          */}
          <Image src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Google Gemini" title="Architected with Gemini" width={100} height={35} className="op-tech-icon" />
          <Image src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="ChatGPT" title="ChatGPT" width={45} height={45} className="op-tech-icon" />
          <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" title="Next.js" width={45} height={45} className="op-tech-icon" />
          <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" alt="Vue.js" title="Vue.js (Admin)" width={45} height={45} className="op-tech-icon" />
          <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" alt="GitHub Actions" title="GitHub Actions (CI/CD)" width={45} height={45} className="op-tech-icon" />
          <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" alt="Terraform" title="Terraform (IaC)" width={45} height={45} className="op-tech-icon" />
          <Image src="https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg" alt="AWS Lambda" title="AWS Lambda" width={45} height={45} className="op-tech-icon" />
          <Image src="https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg" alt="API Gateway" title="AWS API Gateway" width={45} height={45} className="op-tech-icon" />
          <Image src="https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg" alt="DynamoDB" title="Amazon DynamoDB" width={45} height={45} className="op-tech-icon" />
          <Image src="https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg" alt="S3" title="Amazon S3" width={45} height={45} className="op-tech-icon" />
          <Image src="https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg" alt="CloudFront" title="Amazon CloudFront" width={45} height={45} className="op-tech-icon" />
        </div>
      </div>
    </section>
  );
}