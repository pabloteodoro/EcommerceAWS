# 🚀 Arquitetura Serverless e Orientada a Eventos na AWS

Este projeto demonstra a construção de um sistema de gestão modular utilizando uma arquitetura de **microsserviços *serverless*** na Amazon Web Services (AWS), aderindo ao padrão de **Arquitetura Orientada a Eventos (EDA)**.

A arquitetura foi projetada para máxima **escalabilidade**, **resiliência** e **desacoplamento** entre os serviços (Produtos, Pedidos e Faturas) através de comunicação assíncrona.

---

### ✨ Componentes e Tecnologias-Chave

| Categoria | Tecnologia | Função no Projeto |
| :--- | :--- | :--- |
| **Computação** | **AWS Lambda** | Motor *serverless* para execução de toda a lógica de negócio. |
| **Acesso/APIs** | **API Gateway** | Ponto de entrada com APIs **REST** (transações) e **WebSocket** (interações em tempo real). |
| **Dados** | **DynamoDB** | Banco de dados NoSQL de alta performance para persistência dos microsserviços. |
| **Armazenamento** | **S3 (Simple Storage Service)** | Utilizado para armazenamento seguro de arquivos estáticos, como faturas geradas. |
| **Mensageria** | **SNS & SQS** | Implementação de filas e tópicos para comunicação **assíncrona** e desacoplada entre serviços. |
| **Segurança** | **AWS Cognito** | Gerenciamento de identidade e autenticação de usuários (*Customer/Admin*). |
| **E-mail** | **SES (Simple Email Service)** | Serviço utilizado para envio de comunicações transacionais (e.g., confirmação de pedidos). |

### 🛠️ DevOps e Observabilidade

* **Infraestrutura como Código (IaC):** Utilização do **AWS CDK / CloudFormation** para definir, provisionar e gerenciar toda a infraestrutura de forma automatizada e versionável.
* **Monitoramento:** Integração com **Amazon CloudWatch** para coleta de logs e métricas.
* **Rastreamento:** Uso do **AWS X-Ray** para rastreamento distribuído e *debugging* de requisições através dos microsserviços.

---

### 💡 Destaques da Arquitetura

* **Modelo *Pay-per-use***: Otimização de custos devido à natureza *serverless* dos serviços.
* **Acoplamento Flexível**: Adoção do EDA para garantir que a falha em um serviço não paralise os demais.
* **Escalabilidade Automática**: Componentes escalam automaticamente em resposta à demanda.
