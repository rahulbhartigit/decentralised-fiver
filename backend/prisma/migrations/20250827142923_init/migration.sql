-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Worker" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,
    "balance_id" INTEGER NOT NULL,
    "pending_amount" INTEGER NOT NULL,
    "locked_amount" INTEGER NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Select the most clickable thumbnail',
    "user_id" INTEGER NOT NULL,
    "payment_signature" TEXT NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Option" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "option_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "opiton_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "public"."User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_address_key" ON "public"."Worker"("address");

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Option" ADD CONSTRAINT "Option_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_opiton_id_fkey" FOREIGN KEY ("opiton_id") REFERENCES "public"."Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
